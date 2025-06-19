import os
import requests
from fastapi import HTTPException

def insert_to_supabase(table: str, rows: list) -> dict:
    url = os.getenv("SUPABASE_URL") + "/rest/v1/" + table
    api_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    headers = {
        "apikey": api_key,
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation"
    }
    response = requests.post(url, json=rows, headers=headers)
    if not response.ok:
        raise HTTPException(status_code=500, detail=f"Supabase insert error: {response.text}")
    return response.json()
