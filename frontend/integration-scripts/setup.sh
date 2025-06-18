#!/bin/bash

# Safe integration setup script

echo "🚀 Setting up Cloud Extel Dashboard Integration"

# Create separate directory for dashboard (recommended approach)
mkdir -p cloud-extel-dashboard
cd cloud-extel-dashboard

# Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install additional dependencies
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-dropdown-menu @radix-ui/react-progress @radix-ui/react-separator @radix-ui/react-tabs class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate

# Create environment file
cat > .env.local << EOF
# Your existing backend configuration (client-safe)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Dashboard specific settings (client-safe)
NEXT_PUBLIC_DASHBOARD_PORT=3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
EOF

# Create server-only environment file
cat > .env << EOF
# Server-only sensitive variables
BACKEND_URL=http://localhost:8000
API_KEY=your-api-key-here

# Database credentials (server-only)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cloud_extel
DB_USER=your-db-user
DB_PASSWORD=your-db-password
EOF

echo "✅ Dashboard setup complete!"
echo "📝 Next steps:"
echo "1. Update NEXT_PUBLIC_BACKEND_URL in .env.local"
echo "2. Configure your API endpoints in lib/backend-integration.ts"
echo "3. Run 'npm run dev' to start the dashboard"
echo "4. Your main app continues running on its original port"
