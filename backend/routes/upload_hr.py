from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.data_cleaner import clean_excel_for_supabase
from utils.supabase_insert import insert_to_supabase
# from utils.supabase_table import create_table_if_not_exists  # Table creation disabled
import os
import traceback

router = APIRouter()

@router.post("/api/dashboard/hr/upload")
async def upload_hr_excel(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = clean_excel_for_supabase(contents)
        # Convert all Timestamp/date columns to ISO strings
        for col in df.columns:
            if df[col].dtype.name.startswith("datetime") or df[col].dtype.name == "object":
                df[col] = df[col].apply(lambda x: x.isoformat() if hasattr(x, "isoformat") else x)
        # Auto-create table if needed (DISABLED)
        # create_table_if_not_exists("hr", df)
        rows = df.to_dict(orient="records")

        # Insert into Supabase
        result = insert_to_supabase("hr", rows)

        preview = df.head(5).to_dict(orient="records")
        return {
            "filename": file.filename,
            "columns": df.columns.tolist(),
            "rows": len(df),
            "inserted": len(result),
            "preview": preview
        }
    except Exception as e:
        print("UPLOAD ERROR:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
