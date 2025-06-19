import pandas as pd
from io import BytesIO
from fastapi import HTTPException

def clean_excel_for_supabase(contents: bytes) -> pd.DataFrame:
    try:
        # Try reading normally first
        df = pd.read_excel(BytesIO(contents), header=None)

        # Auto-detect header row (row with max non-null cells)
        best_header_row = df.notnull().sum(axis=1).idxmax()
        df.columns = df.iloc[best_header_row]
        df = df.drop(index=range(best_header_row + 1))  # Drop all rows including the header

        # Reset index, clean up
        df = df.reset_index(drop=True)

        # Drop empty rows and columns
        df = df.dropna(how="all")
        df = df.dropna(axis=1, how="all")

        # Fill merged/blank cells
        df = df.ffill().bfill()

        # Strip column names and convert all to strings
        df.columns = [str(col).strip() for col in df.columns]

        # Optional: lowercase and replace spaces for Supabase compatibility
        df.columns = [col.lower().replace(" ", "_") for col in df.columns]

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing Excel file: {e}")

    return df
