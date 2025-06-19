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
from routes.upload_hr import router as upload_hr_router

# Load environment variables from .env file
load_dotenv()

# Debug: Print environment variables to verify loading
print("CLIENT_ID:", os.getenv("CLIENT_ID"))
print("TENANT_ID:", os.getenv("TENANT_ID"))
print("CLIENT_SECRET:", os.getenv("CLIENT_SECRET"))
print("REDIRECT_URI:", os.getenv("REDIRECT_URI"))

# Debug: Print Supabase env variables after loading .env
print("SUPABASE_URL:", os.getenv("SUPABASE_URL"))
print("SUPABASE_SERVICE_ROLE_KEY:", os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

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

# Define upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploaded_reports")
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

app.include_router(upload_hr_router)