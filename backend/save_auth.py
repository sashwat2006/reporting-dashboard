from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:3000")
    input("Log in to your dashboard in the opened browser, then press Enter here...")
    context.storage_state(path="auth.json")
    browser.close()