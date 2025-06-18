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

# Define valid months (1-12 as strings)
MONTHS = [str(i) for i in range(1, 13)]

# Expand departments to match frontend
DEPARTMENTS = [
    "master",
    "wireline",
    "wireless",
    "hr_admin",
    "sales",
    "strategy_bis",
    "financials"
]

UPLOAD_DIR = "uploaded_reports"

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

# Create subfolders for departments
for dept in DEPARTMENTS:
    dept_path = os.path.join(UPLOAD_DIR, dept)
    os.makedirs(dept_path, exist_ok=True)

# Dashboard parser registry for all departments
DASHBOARD_PARSERS: Dict[tuple, Callable[[str], dict]] = {}

def register_dashboard_parser(department: str, dashboard: str):
    def decorator(func: Callable[[str], dict]):
        DASHBOARD_PARSERS[(department, dashboard)] = func
        return func
    return decorator

# --- Example: ITD - All LOBs parser for master ---
@register_dashboard_parser("master", "ITD - All LOBs")
def parse_master_itd_all_lobs(file_obj_or_path) -> dict:
    try:
        # Accept both file path and BytesIO
        if hasattr(file_obj_or_path, 'read'):
            excel_data = pd.read_excel(file_obj_or_path, engine="pyxlsb", sheet_name=None)
        elif isinstance(file_obj_or_path, str) and file_obj_or_path.endswith(".xlsb"):
            excel_data = pd.read_excel(file_obj_or_path, engine="pyxlsb", sheet_name=None)
        else:
            excel_data = pd.read_excel(file_obj_or_path, engine="openpyxl", sheet_name=None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading Excel file: {str(e)}")
    parsed_sheets = {}
    for sheet_name, sheet_data in excel_data.items():
        headers = list(sheet_data.columns)
        rows = sheet_data.fillna("").values.tolist()
        col_types = [
            "number" if pd.api.types.is_numeric_dtype(sheet_data[col]) else "string"
            for col in sheet_data.columns
        ]
        parsed_sheets[sheet_name] = {
            "headers": headers,
            "rows": rows,
            "col_types": col_types,
        }
    # Extract KPIs (same logic as before)
    specific_value = None
    if "Small Cell Summ." in excel_data:
        sheet_data = excel_data["Small Cell Summ."]
        try:
            specific_value = sheet_data.iloc[45, 71]
        except IndexError:
            specific_value = None
    else:
        specific_value = None
    if "Active Summ." in excel_data:
        active_sheet_data = excel_data["Active Summ."]
        try:
            total_active_shared = active_sheet_data.iloc[19, 71]
        except IndexError:
            total_active_shared = None
    else:
        total_active_shared = None
    total_net_volume = None
    if "Active Summ." in excel_data:
        active_sheet_data = excel_data["Active Summ."]
        try:
            total_net_volume = active_sheet_data.iloc[20, 71]
        except Exception:
            total_net_volume = None
    if pd.isna(specific_value):
        specific_value = None
    if pd.isna(total_active_shared):
        total_active_shared = None
    if pd.isna(total_net_volume):
        total_net_volume = None
    total_row_index = None
    unnamed_71_col_index = None
    if "Active Summ." in excel_data:
        active_sheet_data = excel_data["Active Summ."]
        try:
            total_row_index = active_sheet_data.index[active_sheet_data.iloc[:, 0] == "Total"].tolist()
            if total_row_index:
                total_row_index = total_row_index[0]
        except Exception:
            total_row_index = None
        try:
            unnamed_71_col_index = active_sheet_data.columns.get_loc("Unnamed: 71")
        except Exception:
            unnamed_71_col_index = None
    extracted_value = None
    if total_row_index is not None and unnamed_71_col_index is not None:
        try:
            extracted_value = active_sheet_data.iloc[total_row_index, unnamed_71_col_index]
        except Exception:
            extracted_value = None
    if total_row_index is not None and unnamed_71_col_index is not None:
        try:
            total_active_shared = active_sheet_data.iloc[total_row_index, unnamed_71_col_index]
        except Exception:
            total_active_shared = None
    if pd.isna(total_active_shared):
        total_active_shared = None
    if pd.isna(extracted_value):
        extracted_value = None
    total_ftth_home_pass = None
    if "FTTH Summ." in excel_data:
        ftth_sheet_data = excel_data["FTTH Summ."]
        try:
            total_ftth_home_pass = ftth_sheet_data.iloc[22, 71]
        except Exception:
            total_ftth_home_pass = None
    if pd.isna(total_ftth_home_pass):
        total_ftth_home_pass = None
    response = {
        "tabs": ["Net Volume Dashboard", "Weekly Volume Dashboard"],
        "sheets": parsed_sheets,
        "specific_value": {
            "title": "Total Small Cells",
            "value": specific_value
        },
        "total_active_shared": {
            "title": "Total Active Shared",
            "value": total_active_shared
        },
        "total_net_volume": {
            "title": "Total Net Volume",
            "value": total_net_volume
        },
        "extracted_value": {
            "title": "Extracted Value",
            "value": extracted_value
        },
        "total_ftth_home_pass": {
            "title": "Total FTTH Home Pass",
            "value": total_ftth_home_pass
        }
    }
    if "SDU Summ." in excel_data:
        sdu_sheet = excel_data["SDU Summ."]
        try:
            sdu_value = round(sdu_sheet.iloc[9, 69])
            response["sdu_fresh_handover_otdr"] = {
                "title": "SDU (Fresh Handover OTDR)",
                "value": f"{sdu_value} Kms"
            }
        except Exception:
            pass
    if "OHFC Summ." in excel_data:
        ohfc_sheet = excel_data["OHFC Summ."]
        try:
            ohfc_value = round(ohfc_sheet.iloc[9, 71])
            response["ohfc_fresh_handover_otdr"] = {
                "title": "OHFC (Fresh Handover OTDR)",
                "value": f"{ohfc_value} Kms"
            }
        except Exception:
            pass
    if "DF Summ." in excel_data:
        df_sheet = excel_data["DF Summ."]
        try:
            total_handover_value = round(df_sheet.iloc[9, 71])
            response["total_handover"] = {
                "title": "Total Handover",
                "value": f"{total_handover_value} Kms"
            }
        except Exception:
            pass
    small_cells_data = {}
    if "Small Cell Summ." in excel_data:
        small_sheet = excel_data["Small Cell Summ."]
        try:
            small_cells_data = {
                "VIL": small_sheet.iloc[9, 71],
                "VIL-Lite Site": small_sheet.iloc[19, 71],
                "Airtel": small_sheet.iloc[26, 71],
                "Airtel-Lite Site": small_sheet.iloc[36, 71]
            }
        except Exception:
            small_cells_data = {client: None for client in ["VIL", "VIL-Lite Site", "Airtel", "Airtel-Lite Site"]}
    else:
        small_cells_data = {client: None for client in ["VIL", "VIL-Lite Site", "Airtel", "Airtel-Lite Site"]}
    response["small_cells"] = small_cells_data
    active_shared_data = {}
    if "Active Summ." in excel_data:
        active_sheet = excel_data["Active Summ."]
        try:
            active_shared_data = {
                "Airtel": active_sheet.iloc[9, 71],
                "VIL": active_sheet.iloc[12, 71]
            }
        except Exception:
            active_shared_data = {client: None for client in ["Airtel", "VIL"]}
    else:
        active_shared_data = {client: None for client in ["Airtel", "VIL"]}
    response["active_shared"] = active_shared_data
    # Extract specific values for FTTH Home Pass clients
    ftth_home_pass_data = {}
    if "FTTH Summ." in excel_data:
        ftth_sheet = excel_data["FTTH Summ."]
        try:
            ftth_home_pass_data = {
                "Airtel (Sobo)": ftth_sheet.iloc[10, 71],  # BT11
                "Tata Sky": ftth_sheet.iloc[14, 71],      # BT15
                "Airtel (ROM)": ftth_sheet.iloc[18, 71],  # BT19
            }
        except Exception:
            ftth_home_pass_data = {client: None for client in ["Airtel (Sobo)", "Tata Sky", "Airtel (ROM)"]}
    else:
        ftth_home_pass_data = {client: None for client in ["Airtel (Sobo)", "Tata Sky", "Airtel (ROM)"]}
    response["ftth_home_pass"] = ftth_home_pass_data
    return response

# --- Placeholder for other dashboards ---
@register_dashboard_parser("master", "KPI Trending")
def parse_master_kpi_trending(file_path: str) -> dict:
    return {"message": "KPI Trending parser not implemented yet."}

@register_dashboard_parser("wireless", "Acquisition")
def parse_wireless_acquisition(file_path: str) -> dict:
    wb = openpyxl.load_workbook(file_path, data_only=True)
    sheet = wb["Acquisition"] if "Acquisition" in wb.sheetnames else wb.active
    data = []
    for row in sheet.iter_rows(values_only=True):
        data.append(list(row))
    merges = []
    for merged_range in sheet.merged_cells.ranges:
        min_row, min_col, max_row, max_col = merged_range.bounds
        merges.append({
            "row": min_row - 1,
            "col": min_col - 1,
            "rowspan": max_row - min_row + 1,
            "colspan": max_col - min_col + 1,
        })
    cell_styles = []
    for r, row in enumerate(sheet.iter_rows()):
        for c, cell in enumerate(row):
            style = {}
            # Background color (handle theme colors as fallback)
            if cell.fill and isinstance(cell.fill, PatternFill):
                fg = cell.fill.fgColor
                if fg.type == 'rgb' and fg.rgb != '00000000':
                    style["backgroundColor"] = f"#{fg.rgb[-6:]}"
                elif fg.type == 'theme' and hasattr(wb, 'theme'):
                    # fallback: use a default color for theme
                    style["backgroundColor"] = '#e0e0e0'
            # Font
            if cell.font:
                if cell.font.bold:
                    style["fontWeight"] = "bold"
                if cell.font.italic:
                    style["fontStyle"] = "italic"
                if cell.font.underline:
                    style["textDecoration"] = "underline"
                if cell.font.color:
                    if cell.font.color.type == 'rgb' and cell.font.color.rgb != '00000000':
                        style["color"] = f"#{cell.font.color.rgb[-6:]}"
                    elif cell.font.color.type == 'theme' and hasattr(wb, 'theme'):
                        style["color"] = '#000000'
                if cell.font.name:
                    style["fontFamily"] = cell.font.name
                if cell.font.sz:
                    style["fontSize"] = f"{cell.font.sz}px"
            # Alignment
            if cell.alignment:
                if cell.alignment.horizontal:
                    style["textAlign"] = cell.alignment.horizontal
                if cell.alignment.vertical:
                    style["verticalAlign"] = cell.alignment.vertical
            # Borders
            if cell.border:
                for border_name in ["left", "right", "top", "bottom"]:
                    border = getattr(cell.border, border_name)
                    if border and border.style:
                        border_style = {}
                        border_style["style"] = border.style
                        if border.color:
                            if border.color.type == 'rgb' and border.color.rgb != '00000000':
                                border_style["color"] = f"#{border.color.rgb[-6:]}"
                            elif border.color.type == 'theme' and hasattr(wb, 'theme'):
                                border_style["color"] = '#000000'
                        style[f"border{border_name.capitalize()}"] = border_style
            # Number format
            if cell.number_format:
                style["numberFormat"] = cell.number_format
            cell_styles.append({
                "row": r,
                "col": c,
                **style
            })
    # Column widths
    col_widths = []
    for col_idx in range(1, sheet.max_column + 1):
        col_letter = get_column_letter(col_idx)
        width = sheet.column_dimensions[col_letter].width
        col_widths.append(width if width else 10)  # fallback to 10 if not set
    # Row heights
    row_heights = []
    for row_idx in range(1, sheet.max_row + 1):
        height = sheet.row_dimensions[row_idx].height
        row_heights.append(height if height else 15)  # fallback to 15 if not set
    headers = data[0] if data else []
    rows = data[1:] if len(data) > 1 else []
    return {
        "headers": headers,
        "rows": rows,
        "merges": merges,
        "cellStyles": cell_styles,
        "colWidths": col_widths,
        "rowHeights": row_heights
    }

@app.post("/upload/{department}/{year}/{month}/")
async def upload_file(department: str, year: str, month: str, file: UploadFile = File(...)):
    if department not in DEPARTMENTS:
        raise HTTPException(status_code=400, detail="Invalid department")
    if month not in MONTHS:
        raise HTTPException(status_code=400, detail="Invalid month")
    # Only allow 4-digit years
    if not (year.isdigit() and len(year) == 4):
        raise HTTPException(status_code=400, detail="Invalid year")
    dir_path = os.path.join(UPLOAD_DIR, department, year, month)
    os.makedirs(dir_path, exist_ok=True)
    file_location = os.path.join(dir_path, file.filename)
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return {"filename": file.filename, "department": department, "year": year, "month": month}

@app.get("/files/{department}/{month}/")
def list_files(department: str, month: str):
    if department not in DEPARTMENTS:
        raise HTTPException(status_code=400, detail="Invalid department")
    if month not in MONTHS:
        raise HTTPException(status_code=400, detail="Invalid month")
    files = os.listdir(os.path.join(UPLOAD_DIR, department, month))
    return {"files": files}

@app.get("/parse/{department}/{month}/{filename}")
def parse_file(department: str, month: str, filename: str):
    if department not in DEPARTMENTS:
        raise HTTPException(status_code=400, detail="Invalid department")
    if month not in MONTHS:
        raise HTTPException(status_code=400, detail="Invalid month")
    file_path = os.path.join(UPLOAD_DIR, department, month, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    # Check file extension and use appropriate engine
    if filename.endswith(".xlsb"):
        try:
            df = pd.read_excel(file_path, engine="pyxlsb")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading .xlsb file: {str(e)}")
    else:
        try:
            df = pd.read_excel(file_path, engine="openpyxl")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading Excel file: {str(e)}")
    headers = list(df.columns)
    rows = df.fillna("").values.tolist()
    col_types = [
        "number" if pd.api.types.is_numeric_dtype(df[col]) else "string"
        for col in df.columns
    ]
    return {
        "headers": headers,
        "rows": rows,
        "col_types": col_types,
        "filename": filename,
        "department": department,
        "month": month
    }

@app.get("/files/{department}/{year}/{month}/")
def list_files(department: str, year: str, month: str):
    if department not in DEPARTMENTS:
        raise HTTPException(status_code=400, detail="Invalid department")
    if month not in MONTHS:
        raise HTTPException(status_code=400, detail="Invalid month")
    if not (year.isdigit() and len(year) == 4):
        raise HTTPException(status_code=400, detail="Invalid year")
    dir_path = os.path.join(UPLOAD_DIR, department, year, month)
    if not os.path.exists(dir_path):
        return {"files": []}
    files = [f for f in os.listdir(dir_path) if not f.startswith("~$")]
    return {"files": files}

@app.get("/parse/{department}/{year}/{month}/{filename}")
def parse_file(department: str, year: str, month: str, filename: str):
    if department not in DEPARTMENTS:
        raise HTTPException(status_code=400, detail="Invalid department")
    if month not in MONTHS:
        raise HTTPException(status_code=400, detail="Invalid month")
    if not (year.isdigit() and len(year) == 4):
        raise HTTPException(status_code=400, detail="Invalid year")
    file_path = os.path.join(UPLOAD_DIR, department, year, month, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    # Parse all sheets in the Excel file
    try:
        if filename.endswith(".xlsb"):
            excel_data = pd.read_excel(file_path, engine="pyxlsb", sheet_name=None)
        else:
            excel_data = pd.read_excel(file_path, engine="openpyxl", sheet_name=None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading Excel file: {str(e)}")

    # Debugging: Log sheet names and column names
    print("Available sheets:", excel_data.keys())
    if "Small Cell Summ." in excel_data:
        print("Columns in 'Small Cell Summ.':", excel_data["Small Cell Summ."].columns)

    # Prepare response with all sheets
    parsed_sheets = {}
    for sheet_name, sheet_data in excel_data.items():
        headers = list(sheet_data.columns)
        rows = sheet_data.fillna("").values.tolist()
        col_types = [
            "number" if pd.api.types.is_numeric_dtype(sheet_data[col]) else "string"
            for col in sheet_data.columns
        ]
        parsed_sheets[sheet_name] = {
            "headers": headers,
            "rows": rows,
            "col_types": col_types,
        }

    # Extract specific value from cell BT46
    specific_value = None
    if "Small Cell Summ." in excel_data:
        sheet_data = excel_data["Small Cell Summ."]
        try:
            # BT46 corresponds to row 45 (0-based index) and column 71 (0-based index)
            specific_value = sheet_data.iloc[45, 71]
        except IndexError:
            specific_value = None
    else:
        specific_value = None

    # Extract specific value from cell BT20 in 'Active Summ.' sheet
    if "Active Summ." in excel_data:
        active_sheet_data = excel_data["Active Summ."]
        try:
            # BT20 corresponds to row 19 (0-based index) and column 71 (0-based index)
            total_active_shared = active_sheet_data.iloc[19, 71]
            # Debugging: Log raw value of cell BT20 in 'Active Summ.' sheet
            raw_value_bt20 = active_sheet_data.iloc[19, 71]
            print("Raw value of BT20 in 'Active Summ.':", raw_value_bt20)
        except IndexError:
            total_active_shared = None
            print("Cell BT20 in 'Active Summ.' is out of range.")
        except Exception as e:
            total_active_shared = None
            print("Error accessing 'Total Active Shared' value in 'Active Summ.' sheet:", str(e))
    else:
        total_active_shared = None

    # Debugging: Log column names and first few rows in 'Active Summ.' sheet
    if "Active Summ." in excel_data:
        active_sheet_data = excel_data["Active Summ."]
        print("Columns in 'Active Summ.':", active_sheet_data.columns)
        print("First few rows in 'Active Summ.':", active_sheet_data.head())

        try:
            # Find the column index for "Net Volume"
            net_volume_col_index = active_sheet_data.columns.get_loc("Net Volume")
            print("Index of 'Net Volume' column:", net_volume_col_index)

            # Find the row index for "Total"
            total_row_index = active_sheet_data.index[active_sheet_data.iloc[:, 0] == "Total"].tolist()
            print("Indices of rows with 'Total':", total_row_index)

            if total_row_index:
                total_row_index = total_row_index[0]  # Get the first match
                total_net_volume = active_sheet_data.iloc[total_row_index, net_volume_col_index]
                print("Extracted 'Total Net Volume' value:", total_net_volume)
            else:
                total_net_volume = None
                print("Row titled 'Total' not found in 'Active Summ.' sheet.")
        except KeyError:
            total_net_volume = None
            print("Column titled 'Net Volume' not found in 'Active Summ.' sheet.")
        except IndexError:
            total_net_volume = None
            print("Error accessing 'Total Net Volume' value in 'Active Summ.' sheet.")
    else:
        total_net_volume = None

    # Handle NaN values for 'Total Small Cells'
    if pd.isna(specific_value):
        specific_value = None

    # Handle NaN values for 'Total Active Shared'
    if pd.isna(total_active_shared):
        total_active_shared = None

    # Locate the "Total Net Volume" value dynamically
    if "Active Summ." in excel_data:
        active_sheet_data = excel_data["Active Summ."]
        print("Columns in 'Active Summ.':", active_sheet_data.columns)
        print("First few rows in 'Active Summ.':", active_sheet_data.head())

        try:
            # Directly access the value at cell BT20 (row 20, column 71)
            total_net_volume = active_sheet_data.iloc[20, 71]
            print("Extracted 'Total Net Volume' value:", total_net_volume)
        except IndexError:
            total_net_volume = None
            print("Cell BT20 in 'Active Summ.' is out of range.")
        except Exception as e:
            total_net_volume = None
            print("Error accessing 'Total Net Volume' value in 'Active Summ.' sheet:", str(e))
    else:
        total_net_volume = None

    # Handle NaN values for 'Total Net Volume'
    if pd.isna(total_net_volume):
        total_net_volume = None

    # Debugging: Log the contents of row 20 to find the column number
    if "Active Summ." in excel_data:
        active_sheet_data = excel_data["Active Summ."]
        print("Contents of row 20 in 'Active Summ.':\n", active_sheet_data.iloc[20].to_string())

    # Debugging: Search for "Net Volume" and "Total" dynamically
    if "Active Summ." in excel_data:
        active_sheet_data = excel_data["Active Summ."]

        # Search for "Net Volume" in the sheet
        net_volume_cell = active_sheet_data.isin(["Net Volume"]).any(axis=1)
        net_volume_row_index = net_volume_cell[net_volume_cell].index.tolist()
        print("Row indices containing 'Net Volume':", net_volume_row_index)

        if net_volume_row_index:
            net_volume_row_index = net_volume_row_index[0]  # Get the first match
            net_volume_col_index = active_sheet_data.iloc[net_volume_row_index].eq("Net Volume").idxmax()
            print("Column index of 'Net Volume':", net_volume_col_index)

        # Search for "Total" in the sheet
        total_cell = active_sheet_data.isin(["Total"]).any(axis=1)
        total_row_index = total_cell[total_cell].index.tolist()
        print("Row indices containing 'Total':", total_row_index)

        if total_row_index:
            total_row_index = total_row_index[0]  # Get the first match
            total_col_index = active_sheet_data.iloc[total_row_index].eq("Total").idxmax()
            print("Column index of 'Total':", total_col_index)

    # Locate the "Total" row dynamically
    total_row_index = None
    if "Active Summ." in excel_data:
        active_sheet_data = excel_data["Active Summ."]
        try:
            # Find the row index for "Total" in the first column
            total_row_index = active_sheet_data.index[active_sheet_data.iloc[:, 0] == "Total"].tolist()
            if total_row_index:
                total_row_index = total_row_index[0]  # Get the first match
                print("Row index of 'Total':", total_row_index)
            else:
                print("Row titled 'Total' not found in 'Active Summ.' sheet.")
        except Exception as e:
            print("Error locating 'Total' row in 'Active Summ.' sheet:", str(e))

    # Locate the "Unnamed: 71" column dynamically
    unnamed_71_col_index = None
    if "Active Summ." in excel_data:
        active_sheet_data = excel_data["Active Summ."]
        try:
            # Find the column index for "Unnamed: 71"
            unnamed_71_col_index = active_sheet_data.columns.get_loc("Unnamed: 71")
            print("Column index of 'Unnamed: 71':", unnamed_71_col_index)
        except KeyError:
            print("Column titled 'Unnamed: 71' not found in 'Active Summ.' sheet.")
        except Exception as e:
            print("Error locating 'Unnamed: 71' column in 'Active Summ.' sheet:", str(e))

    # Extract the value dynamically
    extracted_value = None
    if total_row_index is not None and unnamed_71_col_index is not None:
        try:
            extracted_value = active_sheet_data.iloc[total_row_index, unnamed_71_col_index]
            print("Extracted value dynamically:", extracted_value)
        except Exception as e:
            print("Error dynamically extracting value:", str(e))
            extracted_value = None

    # Ensure 'Total Active Shared' is updated with the extracted value
    if total_row_index is not None and unnamed_71_col_index is not None:
        try:
            total_active_shared = active_sheet_data.iloc[total_row_index, unnamed_71_col_index]
            print("Updated 'Total Active Shared' dynamically:", total_active_shared)
        except Exception as e:
            print("Error updating 'Total Active Shared' dynamically:", str(e))
            total_active_shared = None

    # Update response to include dynamically updated 'Total Active Shared'
    response = {
        "tabs": ["Net Volume Dashboard", "Weekly Volume Dashboard"],
        "sheets": parsed_sheets,
        "total_small_cells": {
            "title": "Small Cells",
            "value": specific_value
        },
        "total_active_shared": {
            "title": "Total Active Shared",
            "value": total_active_shared
        },
        "total_net_volume": {
            "title": "Total Net Volume",
            "value": total_net_volume
        },
        "extracted_value": {
            "title": "Extracted Value",
            "value": extracted_value
        }
    }

    # Debugging: Log rows 15 to 25 in an organized manner

    # Locate the column dynamically for 'Unnamed: 71' and extract value from row 18
    if "Active Summ." in excel_data:
        active_sheet_data = excel_data["Active Summ."]
        try:
            # Dynamically find the column index for 'Unnamed: 71'
            column_name = "Unnamed: 71"
            if column_name in active_sheet_data.columns:
                column_index = active_sheet_data.columns.get_loc(column_name)
                print("Column index for 'Unnamed: 71':", column_index)

                # Extract the value at row 18 and 'Unnamed: 71' column
                value_119 = active_sheet_data.iloc[17, column_index]
                print("Extracted value at row 18, 'Unnamed: 71' column:", value_119)
            else:
                print("Column 'Unnamed: 71' not found in 'Active Summ.' sheet.")
        except Exception as e:
            print("Error locating 'Unnamed: 71' column or extracting value:", str(e))

    # Debugging: Check raw data type of extracted value
    if total_row_index is not None and unnamed_71_col_index is not None:
        try:
            raw_value = active_sheet_data.iloc[total_row_index, unnamed_71_col_index]
            print("Raw value at 'Total' row and 'Unnamed: 71' column:", raw_value)
            print("Data type of raw value:", type(raw_value))

            # Attempt to convert to numeric
            extracted_value = pd.to_numeric(raw_value, errors='coerce')
            print("Converted value:", extracted_value)
        except Exception as e:
            print("Error checking raw value or converting to numeric:", str(e))

    # Extract specific value from cell BT23 in 'FTTH Summ.' sheet
    total_ftth_home_pass = None
    if "FTTH Summ." in excel_data:
        ftth_sheet_data = excel_data["FTTH Summ."]
        try:
            # BT23 corresponds to row 22 (0-based index) and column 71 (0-based index)
            total_ftth_home_pass = ftth_sheet_data.iloc[22, 71]
            print("Raw value of BT23 in 'FTTH Summ.':", total_ftth_home_pass)
        except IndexError:
            total_ftth_home_pass = None
            print("Cell BT23 in 'FTTH Summ.' is out of range.")
        except Exception as e:
            total_ftth_home_pass = None
            print("Error accessing 'Total FTTH Home Pass' value in 'FTTH Summ.' sheet:", str(e))
    else:
        total_ftth_home_pass = None

    # Handle NaN values for 'Total FTTH Home Pass'
    if pd.isna(total_ftth_home_pass):
        total_ftth_home_pass = None

    # Update response to include 'Total FTTH Home Pass'
    response = {
        "tabs": ["Net Volume Dashboard", "Weekly Volume Dashboard"],
        "sheets": parsed_sheets,
        "specific_value": {
            "title": "Total Small Cells",
            "value": specific_value
        },
        "total_active_shared": {
            "title": "Total Active Shared",
            "value": total_active_shared
        },
        "total_net_volume": {
            "title": "Total Net Volume",
            "value": total_net_volume
        },
        "extracted_value": {
            "title": "Extracted Value",
            "value": extracted_value
        },
        "total_ftth_home_pass": {
            "title": "Total FTTH Home Pass",
            "value": total_ftth_home_pass
        }
    }

    # Extract SDU (Fresh Handover OTDR) value if available
    if "SDU Summ." in excel_data:
        sdu_sheet = excel_data["SDU Summ."]
        sdu_value = round(sdu_sheet.iloc[9, 69])  # Adjust column index to 70 (0-based index)
        print("Corrected SDU (Fresh Handover OTDR):", sdu_value)
        response["sdu_fresh_handover_otdr"] = {
            "title": "SDU (Fresh Handover OTDR)",
            "value": f"{sdu_value} Kms"
        }



    # Add debugging logs for SDU (Fresh Handover OTDR)
    print("SDU sheet exists in Excel data:", "SDU Summ." in excel_data)
    if "SDU Summ." in excel_data:
        sdu_sheet = excel_data["SDU Summ."]
        print("SDU sheet row 10 values:", sdu_sheet.iloc[9].values)
        print("SDU sheet row 10 column 70 value:", sdu_sheet.iloc[9, 69])

    # Extract OHFC (Fresh Handover OTDR) value if available
    if "OHFC Summ." in excel_data:
        ohfc_sheet = excel_data["OHFC Summ."]
        ohfc_value = round(ohfc_sheet.iloc[9, 71])  # Adjust column index to 72 (0-based index)
        print("Corrected OHFC (Fresh Handover OTDR):", ohfc_value)
        response["ohfc_fresh_handover_otdr"] = {
            "title": "OHFC (Fresh Handover OTDR)",
            "value": f"{ohfc_value} Kms"
        }


    # Extract Total Handover value if available
    if "DF Summ." in excel_data:
        df_sheet = excel_data["DF Summ."]
        total_handover_value = round(df_sheet.iloc[9, 71])  # Adjust column index to 72 (0-based index)
        print("Corrected Total Handover:", total_handover_value)
        response["total_handover"] = {
            "title": "Total Handover",
            "value": f"{total_handover_value} Kms"
        }

    # Extract specific values for Small Cells
    small_cells_data = {}
    if "Small Cell Summ." in excel_data:
        small_sheet = excel_data["Small Cell Summ."]
        try:
            small_cells_data = {
                "VIL": small_sheet.iloc[9, 71],
                "VIL-Lite Site": small_sheet.iloc[19, 71],
                "Airtel": small_sheet.iloc[26, 71],
                "Airtel-Lite Site": small_sheet.iloc[36, 71]
            }
        except IndexError:
            small_cells_data = {client: None for client in ["VIL", "VIL-Lite Site", "Airtel", "Airtel-Lite Site"]}
    else:
        small_cells_data = {client: None for client in ["VIL", "VIL-Lite Site", "Airtel", "Airtel-Lite Site"]}

    response["small_cells"] = small_cells_data

    # Extract specific values for Active Shared
    active_shared_data = {}
    if "Active Summ." in excel_data:
        active_sheet = excel_data["Active Summ."]
        try:
            active_shared_data = {
                "Airtel": active_sheet.iloc[9, 71],
                "VIL": active_sheet.iloc[12, 71]
            }
        except IndexError as e:
            print("Error extracting Active Shared data:", e)
            active_shared_data = {client: None for client in ["Airtel", "VIL"]}
    else:
        print("Active Summ. sheet not found in Excel data.")
        active_shared_data = {client: None for client in ["Airtel", "VIL"]}

    response["active_shared"] = active_shared_data

    # Extract specific values for FTTH Home Pass clients
    ftth_home_pass_data = {}
    if "FTTH Summ." in excel_data:
        ftth_sheet = excel_data["FTTH Summ."]
        try:
            ftth_home_pass_data = {
                "Airtel (Sobo)": ftth_sheet.iloc[10, 71],  # BT11
                "Tata Sky": ftth_sheet.iloc[14, 71],      # BT15
                "Airtel (ROM)": ftth_sheet.iloc[18, 71],  # BT19
            }
        except Exception:
            ftth_home_pass_data = {client: None for client in ["Airtel (Sobo)", "Tata Sky", "Airtel (ROM)"]}
    else:
        ftth_home_pass_data = {client: None for client in ["Airtel (Sobo)", "Tata Sky", "Airtel (ROM)"]}
    response["ftth_home_pass"] = ftth_home_pass_data

    return response

# Mapping for departments that use a single file for all dashboards
DEPT_DASHBOARD_FILE = {
    "wireless": "Wireless Dashboards.xlsx"
    # Add more departments and their main files here as needed
}

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