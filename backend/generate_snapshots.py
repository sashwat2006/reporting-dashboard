#!/usr/bin/env python3
"""
Script to generate dashboard snapshots as images using Playwright (headless Chromium).
- Captures each dashboard page as a PNG and saves to frontend/public/static/snapshots/
- Should be run before sending weekly status update emails.
"""
import os
import asyncio
import sys
from playwright.async_api import async_playwright

# Dashboard config (should match frontend)
DASHBOARDS = {
    "master": ["ITD - All LOBs", "KPI Trending", "IRR Trending"],
    "wireless": ["Acquisition", "Build", "Operations", "Quality"],
    "wireline": ["ITD - LOB level", "Funnel & Buyer Types "],
    "hr_admin": ["Attrition", "Manpower Utilization"],
    "sales": ["New Customers & Initiatives", "Funnel Availability", "Customer NPS", "Market Share"],
    "strategy_bis": ["ITD - LOB level", "Funnel & Buyer Types "],
    "financials": ["Annual Recurring Revenue"],
}

DASHBOARD_BASE_URL = os.environ.get("DASHBOARD_BASE_URL", "http://localhost:3000/")
SNAPSHOT_DIR = os.path.join(os.getcwd(), "frontend", "public", "static", "snapshots")
os.makedirs(SNAPSHOT_DIR, exist_ok=True)

# Optionally: Add login automation if your dashboards require authentication
LOGIN_EMAIL = os.environ.get("SNAPSHOT_USER")
LOGIN_PASS = os.environ.get("SNAPSHOT_PASS")
LOGIN_URL = os.environ.get("SNAPSHOT_LOGIN_URL", f"{DASHBOARD_BASE_URL}login")

async def login_if_needed(page):
    if LOGIN_EMAIL and LOGIN_PASS:
        await page.goto(LOGIN_URL)
        # Example: fill login form (adjust selectors as needed)
        try:
            await page.fill('input[type="email"]', LOGIN_EMAIL)
            await page.fill('input[type="password"]', LOGIN_PASS)
            await page.click('button[type="submit"]')
            await page.wait_for_timeout(2000)
            print("[Snapshot] Login attempted.")
        except Exception as e:
            print(f"[Snapshot] Login step skipped or failed: {e}")

async def capture_snapshots():
    # Allow filtering by department via env or arg
    dept_filter = os.environ.get("SNAPSHOT_DEPARTMENT")
    if len(sys.argv) > 1:
        dept_filter = sys.argv[1]
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await login_if_needed(page)
        for dept, dashboards in DASHBOARDS.items():
            if dept_filter and dept != dept_filter:
                continue
            for dashboard in dashboards:
                dashboard_param = dashboard.replace(" ", "%20")
                url = f"{DASHBOARD_BASE_URL}?department={dept}&dashboard={dashboard_param}"
                print(f"Capturing {url}")
                await page.goto(url, wait_until="networkidle")
                # Wait for dashboard to render (tweak selector as needed)
                await page.wait_for_timeout(3000)
                img_name = f"{dept}_{dashboard}.png".replace(" ", "_")
                img_path = os.path.join(SNAPSHOT_DIR, img_name)
                await page.screenshot(path=img_path, full_page=True)
                print(f"Saved snapshot: {img_path}")
        await browser.close()

if __name__ == "__main__":
    # Optionally allow department filter from command line
    asyncio.run(capture_snapshots())
