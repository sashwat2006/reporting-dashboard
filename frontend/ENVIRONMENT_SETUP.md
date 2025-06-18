# Environment Variables Setup Guide

## Client-Safe Variables (can be exposed to browser)
Add these to `.env.local`:

\`\`\`bash
# Frontend configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_DASHBOARD_PORT=3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
\`\`\`

## Server-Only Variables (sensitive - never exposed to client)
Add these to `.env` (server-only):

\`\`\`bash
# Backend API credentials
BACKEND_URL=http://localhost:8000
API_KEY=your-actual-api-key-here

# Database credentials
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=cloud_extel
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# External API keys
MONGODB_URI=mongodb://localhost:27017/cloud_extel
REDIS_URL=redis://localhost:6379
SALESFORCE_API_URL=https://your-instance.salesforce.com
QUICKBOOKS_API_URL=https://sandbox-quickbooks.api.intuit.com
\`\`\`

## Security Notes

1. **Never use `NEXT_PUBLIC_` prefix for sensitive data**
2. **API keys are now handled server-side only**
3. **Client makes requests to `/api/backend/*` routes**
4. **Server routes proxy to your actual backend with credentials**
5. **Add `.env` to `.gitignore` to prevent committing secrets**

## Deployment

For production deployment:
- Set server-only variables in your hosting platform's environment settings
- Only set `NEXT_PUBLIC_*` variables that are safe to expose
- Use secrets management for sensitive credentials
