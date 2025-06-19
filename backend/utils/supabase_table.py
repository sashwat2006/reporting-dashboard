import os
import requests
from fastapi import HTTPException
import pandas as pd

def infer_pg_type(dtype):
    if pd.api.types.is_integer_dtype(dtype):
        return "bigint"
    elif pd.api.types.is_float_dtype(dtype):
        return "double precision"
    elif pd.api.types.is_datetime64_any_dtype(dtype):
        return "timestamp"
    else:
        return "text"

def create_table_if_not_exists(table: str, df: pd.DataFrame):
    url = os.getenv("SUPABASE_URL") + "/rest/v1/rpc/execute_sql"
    api_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    headers = {
        "apikey": api_key,
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    # Build CREATE TABLE SQL
    columns = []
    for col in df.columns:
        pg_type = infer_pg_type(df[col].dtype)
        columns.append(f'"{col}" {pg_type}')
    sql = f'CREATE TABLE IF NOT EXISTS "{table}" ({", ".join(columns)});'
    payload = {"sql": sql}
    response = requests.post(url, json=payload, headers=headers)
    if not response.ok:
        raise HTTPException(status_code=500, detail=f"Supabase table create error: {response.text}")
    return response.json()
