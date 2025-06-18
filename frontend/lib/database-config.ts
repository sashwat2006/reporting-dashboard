// Database Configuration Options

export const databaseOptions = {
  // Option 1: PostgreSQL with Supabase (Recommended for real-time)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    features: ["Real-time subscriptions", "Built-in auth", "Row-level security"],
  },

  // Option 2: MySQL/PostgreSQL with traditional setup
  traditional: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  // Option 3: MongoDB for document-based data
  mongodb: {
    uri: process.env.MONGODB_URI,
    database: process.env.MONGODB_DATABASE,
  },

  // Option 4: Redis for caching and real-time data
  redis: {
    url: process.env.REDIS_URL,
    useFor: ["Caching", "Real-time pub/sub", "Session storage"],
  },
}

// Data Sources Configuration
export const dataSources = {
  // Internal systems
  internal: {
    crm: "https://api.yourcompany.com/crm",
    billing: "https://api.yourcompany.com/billing",
    hr: "https://api.yourcompany.com/hr",
    network: "https://api.yourcompany.com/network",
  },

  // External APIs
  external: {
    salesforce: process.env.SALESFORCE_API_URL,
    quickbooks: process.env.QUICKBOOKS_API_URL,
    googleAnalytics: process.env.GA_API_URL,
  },

  // Real-time data streams
  realtime: {
    websocket: "wss://your-api.com/ws",
    serverSentEvents: "https://your-api.com/events",
    socketIO: "https://your-api.com:3001",
  },
}
