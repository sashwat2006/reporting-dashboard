# Unified Internal Reporting Dashboard

This project is a web-based dashboard for uploading, visualizing, and comparing weekly Excel reports from multiple departments. It uses FastAPI (Python) for the backend and React (Vite) for the frontend.

## Features
- Upload Excel files for each department
- Department-specific dashboard tabs
- KPI visualizations and summaries
- Date range toggling for comparisons
- No database required; files are stored and parsed on-demand

## Getting Started

### Backend (FastAPI)
1. Activate the Python virtual environment:
   ```powershell
   .\backend-env\Scripts\Activate.ps1
   ```
2. Run the FastAPI server:
   ```powershell
   uvicorn main:app --reload
   ```

### Frontend (React)
1. Install dependencies:
   ```powershell
   cd frontend
   npm install
   ```
2. Start the development server:
   ```powershell
   npm run dev
   ```

## Folder Structure
- `backend-env/` - Python virtual environment
- `frontend/` - React frontend (Vite)
- `main.py` - FastAPI backend entry point (to be created)

## Next Steps
- Implement FastAPI endpoints for file upload and KPI parsing
- Build React components for dashboard UI
