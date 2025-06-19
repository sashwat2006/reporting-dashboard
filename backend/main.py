from fastapi import FastAPI, UploadFile, File, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse, FileResponse, StreamingResponse
import os
from typing import List, Callable, Dict
import pandas as pd
from datetime import datetime
import importlib.util
from urllib.parse import urlencode
import requests
from dotenv import load_dotenv
from io import BytesIO
import openpyxl
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import glob
from fastapi import BackgroundTasks, Request
import requests
import glob
import base64
import subprocess

# Load environment variables from .env file
load_dotenv()

# Debug: Print environment variables to verify loading
print("CLIENT_ID:", os.getenv("CLIENT_ID"))
print("TENANT_ID:", os.getenv("TENANT_ID"))
print("CLIENT_SECRET:", os.getenv("CLIENT_SECRET"))
print("REDIRECT_URI:", os.getenv("REDIRECT_URI"))

# Read environment variables
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
TENANT_ID = os.getenv("TENANT_ID")
REDIRECT_URI = os.getenv("REDIRECT_URI", "http://localhost:8000/auth/callback")
SCOPE = "offline_access Files.Read.All User.Read"


app = FastAPI()

# Global storage for parsed data
parsed_data = {}

# Allow frontend dev server to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://v0-cloud-extel-insights-hub.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)


def fetch_sharepoint_file(token: str, dashboard_name: str, department: str = None):
    headers = {"Authorization": f"Bearer {token}"}
    # 1. Find 'CE Dashboards' in sharedWithMe
    url = "https://graph.microsoft.com/v1.0/me/drive/sharedWithMe"
    print(f"[DEBUG] Querying OneDrive sharedWithMe: {url}")
    resp = requests.get(url, headers=headers)
    print(f"[DEBUG] sharedWithMe response status: {resp.status_code}")
    if resp.status_code != 200:
        print(f"[DEBUG] sharedWithMe response text: {resp.text[:500]}")
        raise HTTPException(status_code=500, detail="Failed to query sharedWithMe")
    items = resp.json().get("value", [])
    ce_dashboards = None
    for item in items:
        if item.get("name") == "CE Dashboards":
            ce_dashboards = item.get("remoteItem", {})
            break
    if not ce_dashboards:
        raise HTTPException(status_code=404, detail="'CE Dashboards' folder not found in sharedWithMe.")
    ce_drive_id = ce_dashboards.get("parentReference", {}).get("driveId")
    ce_id = ce_dashboards.get("id")
    print(f"[DEBUG] Found 'CE Dashboards' | driveId: {ce_drive_id} | id: {ce_id}")
    # 2. List children to find department folder
    dept_url = f"https://graph.microsoft.com/v1.0/drives/{ce_drive_id}/items/{ce_id}/children"
    print(f"[DEBUG] Listing children of 'CE Dashboards': {dept_url}")
    dept_resp = requests.get(dept_url, headers=headers)
    if dept_resp.status_code != 200:
        print(f"[DEBUG] Dept children response text: {dept_resp.text[:500]}")
        raise HTTPException(status_code=500, detail="Failed to list CE Dashboards children")
    dept_items = dept_resp.json().get("value", [])
    dept_folder = None
    for item in dept_items:
        if item.get("name") == department and item.get("folder"):
            dept_folder = item
            break
    if not dept_folder:
        raise HTTPException(status_code=404, detail=f"Department folder '{department}' not found in CE Dashboards.")
    dept_id = dept_folder.get("id")
    print(f"[DEBUG] Found department folder '{department}' | id: {dept_id}")
    # 3. List children of department folder
    file_url = f"https://graph.microsoft.com/v1.0/drives/{ce_drive_id}/items/{dept_id}/children"
    print(f"[DEBUG] Listing children of department folder: {file_url}")
    file_resp = requests.get(file_url, headers=headers)
    if file_resp.status_code != 200:
        print(f"[DEBUG] File children response text: {file_resp.text[:500]}")
        raise HTTPException(status_code=500, detail="Failed to list department folder children")
    file_items = file_resp.json().get("value", [])
    print(f"[DEBUG] Files in department folder '{department}':")
    for item in file_items:
        if not item.get("folder"):
            print(f"  - {item.get('name')}")
    # If department uses a main file, always fetch that file
    dashboard_file = None
    sheet_name = None
    if department in DEPT_DASHBOARD_FILE:
        main_file = DEPT_DASHBOARD_FILE[department]
        for item in file_items:
            if not item.get("folder") and item.get("name") == main_file:
                dashboard_file = item
                sheet_name = dashboard_name  # Use dashboard_name as sheet name
                break
        if not dashboard_file:
            print(f"[DEBUG] No file named '{main_file}' found in department folder '{department}'. Available files:")
            for item in file_items:
                if not item.get("folder"):
                    print(f"  - {item.get('name')}")
            raise HTTPException(status_code=404, detail=f"No file named '{main_file}' found in department folder '{department}'.")
    else:
        # Otherwise, match file name to dashboard_name as before
        for item in file_items:
            if not item.get("folder"):
                file_name = item.get("name", "")
                base_name = file_name.rsplit('.', 1)[0]
                if base_name == dashboard_name:
                    dashboard_file = item
                    break
        if not dashboard_file:
            print(f"[DEBUG] No file found in department folder '{department}' matching '{dashboard_name}'. Available files:")
            for item in file_items:
                if not item.get("folder"):
                    print(f"  - {item.get('name')}")
            raise HTTPException(status_code=404, detail=f"No file named '{dashboard_name}' found in department folder '{department}'.")
    file_id = dashboard_file.get("id")
    file_name = dashboard_file.get("name")
    print(f"[DEBUG] Found dashboard file: {file_name} | id: {file_id}")
    # 4. Download and return the file content and extension, and sheet_name if set
    download_url = f"https://graph.microsoft.com/v1.0/drives/{ce_drive_id}/items/{file_id}/content"
    print(f"[DEBUG] Downloading dashboard file: {download_url}")
    download_resp = requests.get(download_url, headers=headers)
    print(f"[DEBUG] File download response status: {download_resp.status_code}")
    if download_resp.status_code == 200:
        ext = '.' + file_name.split('.')[-1]
        # Debug: List all sheet names in the Excel file
        try:
            if ext == '.xlsb':
                xls = pd.ExcelFile(BytesIO(download_resp.content), engine='pyxlsb')
            else:
                xls = pd.ExcelFile(BytesIO(download_resp.content), engine='openpyxl')
            print(f"[DEBUG] Available sheets in '{file_name}': {xls.sheet_names}")
        except Exception as e:
            print(f"[DEBUG] Error reading sheet names: {e}")
        print(f"[DEBUG] Requested sheet: {sheet_name}")
        return download_resp.content, ext, sheet_name, file_name
    else:
        print(f"[DEBUG] File download response text: {download_resp.text[:500]}")
        raise HTTPException(status_code=404, detail=f"Failed to download dashboard file '{file_name}'.")

@app.get("/parse/{department}/{dashboard_name}")
def parse_dashboard_file(department: str, dashboard_name: str, request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        file_bytes, ext, sheet_name, file_name = fetch_sharepoint_file(token, dashboard_name, department)
    except HTTPException as e:
        return JSONResponse({"error": str(e.detail)}, status_code=e.status_code)
    # Use custom parser for master/ITD - All LOBs
    if department == "master" and dashboard_name == "ITD - All LOBs":
        return parse_master_itd_all_lobs(BytesIO(file_bytes))
    # Generic parsing: if sheet_name is provided, only parse that sheet
    try:
        if ext == ".xlsb":
            if sheet_name:
                sheet_data = pd.read_excel(BytesIO(file_bytes), engine="pyxlsb", sheet_name=sheet_name)
            else:
                excel_data = pd.read_excel(BytesIO(file_bytes), engine="pyxlsb", sheet_name=None)
        else:
            if sheet_name:
                sheet_data = pd.read_excel(BytesIO(file_bytes), engine="openpyxl", sheet_name=sheet_name)
            else:
                excel_data = pd.read_excel(BytesIO(file_bytes), engine="openpyxl", sheet_name=None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading Excel file: {str(e)}")
    # If only one sheet is parsed, wrap it in a dict for consistency
    if sheet_name and isinstance(sheet_data, pd.DataFrame):
        # Re-read the sheet with header=3 (row 4 as header)
        if ext == '.xlsb':
            df = pd.read_excel(BytesIO(file_bytes), engine='pyxlsb', sheet_name=sheet_name, header=3)
        else:
            df = pd.read_excel(BytesIO(file_bytes), engine='openpyxl', sheet_name=sheet_name, header=3)
        df = df.dropna(how='all').dropna(axis=1, how='all')
        df = df.ffill(axis=0).ffill(axis=1)
        headers = list(df.columns)
        rows = df.fillna("").values.tolist()
        col_types = [
            "number" if pd.api.types.is_numeric_dtype(df[col]) else "string"
            for col in df.columns
        ]
        return {
            "sheets": {
                sheet_name: {
                    "headers": headers,
                    "rows": rows,
                    "col_types": col_types,
                }
            },
            "filename": file_name,
            "department": department
        }
    # Fallback: If not a single sheet, return all sheets as before
    parsed_sheets = {}
    for sname, sdata in excel_data.items():
        headers = list(sdata.columns)
        rows = sdata.fillna("").values.tolist()
        col_types = [
            "number" if pd.api.types.is_numeric_dtype(sdata[col]) else "string"
            for col in sdata.columns
        ]
        parsed_sheets[sname] = {
            "headers": headers,
            "rows": rows,
            "col_types": col_types,
        }
    return {
        "sheets": parsed_sheets,
        "filename": file_name,
        "department": department
    }

# Microsoft OAuth2 URLs (must be defined before endpoints)
AUTH_URL = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/authorize"
TOKEN_URL = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token"

@app.get("/auth/login")
def login():
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "response_mode": "query",
        "scope": SCOPE,
        "state": "12345"
    }
    url = f"{AUTH_URL}?{urlencode(params)}"
    return RedirectResponse(url)

@app.get("/auth/callback")
def auth_callback(code: str = None, state: str = None):
    if not code:
        return JSONResponse({"error": "No code provided"}, status_code=400)
    data = {
        "client_id": CLIENT_ID,
        "scope": SCOPE,
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
        "client_secret": CLIENT_SECRET,
    }
    response = requests.post(TOKEN_URL, data=data)
    token_data = response.json()
    # Set the access token in a secure cookie and redirect to frontend
    redirect_url = "http://localhost:3000/"  # Redirect to Next.js frontend
    resp = RedirectResponse(url=redirect_url)
    # Set cookie (HttpOnly for security, not accessible to JS)
    if "access_token" in token_data:
        resp.set_cookie(
            key="access_token",
            value=token_data["access_token"],
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite="lax",
            max_age=token_data.get("expires_in", 3600)
        )
    return resp

@app.get("/me")
def me(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        return JSONResponse({"authenticated": False}, status_code=401)
    # Call Microsoft Graph to get user info
    headers = {"Authorization": f"Bearer {token}"}
    graph_resp = requests.get("https://graph.microsoft.com/v1.0/me", headers=headers)
    if graph_resp.status_code != 200:
        return JSONResponse({"authenticated": False}, status_code=401)
    user = graph_resp.json()
    return {
        "authenticated": True,
        "name": user.get("displayName"),
        "email": user.get("mail") or user.get("userPrincipalName"),
    }

@app.get("/auth/logout")
def logout():
    resp = RedirectResponse(url="http://localhost:3000/")
    resp.delete_cookie("access_token")
    return resp

@app.get("/download/{department}/{filename}")
def download_file(department: str, filename: str, request: Request):
    # For wireless/Wireless Dashboards.xlsx, fetch from OneDrive/SharePoint using Graph API
    if department == "wireless" and filename == "Wireless Dashboards.xlsx":
        token = request.cookies.get("access_token")
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
        # Use fetch_sharepoint_file to get the file bytes
        try:
            file_bytes, ext, sheet_name, file_name = fetch_sharepoint_file(token, "Wireless Dashboards", department=department)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        return StreamingResponse(BytesIO(file_bytes), media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers={"Content-Disposition": f"attachment; filename={filename}"})
    # Fallback to local file logic for other departments/files
    file_path = os.path.join(UPLOAD_DIR, department, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', filename=filename)

@app.post("/send-status-update")
def send_status_update(background_tasks: BackgroundTasks, request: Request):
    """
    Send a weekly status update email with dashboard snapshots as images (linked to dashboards).
    Uses Microsoft Graph API for company accounts.
    Now: Runs snapshot script for 'wireless' dashboards before sending email.
    """
    # Config
    CLIENT_ID = os.getenv("CLIENT_ID")
    CLIENT_SECRET = os.getenv("CLIENT_SECRET")
    TENANT_ID = os.getenv("TENANT_ID")
    RECIPIENTS = os.getenv("STATUS_UPDATE_RECIPIENTS", "").split(",")
    DASHBOARD_BASE_URL = os.getenv("DASHBOARD_BASE_URL", "http://localhost:3000/")
    SNAPSHOT_DIR = os.path.join(os.getcwd(), "frontend", "public", "static", "snapshots")
    SENDER = os.getenv("GRAPH_SENDER") or os.getenv("OUTLOOK_USER")

    # Run snapshot script for 'wireless' only
    try:
        result = subprocess.run([
            os.environ.get("PYTHON_EXECUTABLE", "python"),
            os.path.join(os.getcwd(), "generate_snapshots.py"),
            "wireless"
        ], capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            print("[Snapshot] Error:", result.stderr)
            raise HTTPException(status_code=500, detail=f"Snapshot generation failed: {result.stderr}")
        print("[Snapshot] Output:", result.stdout)
    except Exception as e:
        print("[Snapshot] Exception:", e)
        raise HTTPException(status_code=500, detail=f"Snapshot generation failed: {e}")

    # Find all snapshot images (wireless only)
    image_files = [f for f in glob.glob(os.path.join(SNAPSHOT_DIR, "wireless_*.png"))]
    if not image_files:
        raise HTTPException(status_code=404, detail="No wireless dashboard snapshots found.")

    # Compose HTML with images and links
    html = """
    <html><body>
    <h2 style='font-family:Montserrat,sans-serif;color:#0a1833;'>Weekly Dashboard Status Update</h2>
    <p style='font-size:1.1em;'>See the latest wireless dashboards below. Click any image to view the live dashboard.</p>
    <div style='display:flex;flex-wrap:wrap;gap:32px;'>
    """
    attachments = []
    for img_path in image_files:
        img_name = os.path.basename(img_path)
        dashboard_name = os.path.splitext(img_name)[0].replace("_", " ")[9:]  # remove 'wireless_'
        dashboard_url = f"{DASHBOARD_BASE_URL}?department=wireless&dashboard={dashboard_name.replace(' ', '%20')}"
        cid = img_name.replace('.', '_')
        html += f"<div style='text-align:center;'><a href='{dashboard_url}'><img src='cid:{cid}' style='max-width:400px;border-radius:12px;box-shadow:0 2px 16px #00B8D9;' alt='{dashboard_name}'/></a><br/><span style='font-weight:600;font-size:1.1em;'>{dashboard_name}</span></div>"
        # Prepare attachment for Graph API
        with open(img_path, "rb") as f:
            img_bytes = f.read()
        attachments.append({
            "@odata.type": "#microsoft.graph.fileAttachment",
            "name": img_name,
            "contentType": "image/png",
            "contentBytes": base64.b64encode(img_bytes).decode(),
            "isInline": True,
            "contentId": cid
        })
    html += "</div></body></html>"

    def send_graph_email():
        # 1. Get access token
        token_url = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token"
        data = {
            "client_id": CLIENT_ID,
            "scope": "https://graph.microsoft.com/.default",
            "client_secret": CLIENT_SECRET,
            "grant_type": "client_credentials"
        }
        token_resp = requests.post(token_url, data=data)
        if token_resp.status_code != 200:
            print("[Graph] Token error:", token_resp.text)
            return
        access_token = token_resp.json().get("access_token")
        # 2. Send email
        graph_url = f"https://graph.microsoft.com/v1.0/users/{SENDER}/sendMail"
        message = {
            "message": {
                "subject": "Weekly Wireless Status Update",
                "body": {
                    "contentType": "HTML",
                    "content": html
                },
                "toRecipients": [{"emailAddress": {"address": r.strip()}} for r in RECIPIENTS if r.strip()],
                "attachments": attachments
            },
            "saveToSentItems": "true"
        }
        headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
        resp = requests.post(graph_url, json=message, headers=headers)
        if resp.status_code >= 400:
            print("[Graph] SendMail error:", resp.text)
        else:
            print("[Graph] Email sent!")

    background_tasks.add_task(send_graph_email)
    return {"status": "Wireless email send initiated (Graph API)"}

    from fastapi import UploadFile, File

@app.post("/api/dashboard/hr/upload")
async def upload_hr_excel(file: UploadFile = File(...)):
    contents = await file.read()
    
    # Parse the Excel file with pandas
    try:
        df = pd.read_excel(BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid Excel file: {e}")

    # Just return a confirmation for now
    return {
        "filename": file.filename,
        "rows": len(df),
        "columns": list(df.columns)
    }