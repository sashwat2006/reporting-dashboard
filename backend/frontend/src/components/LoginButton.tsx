import React, { useEffect, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function LoginButton() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always include credentials so cookies are sent for authentication
    fetch(`${BACKEND_URL}/me`, { credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) throw new Error('Not authenticated');
        return r.json();
      })
      .then((data) => {
        if (data.authenticated) {
          setUser({ name: data.name, email: data.email });
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/login`;
  };

  const handleLogout = () => {
    window.location.href = `${BACKEND_URL}/auth/logout`;
  };

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-white/90 font-semibold">Welcome, {user.name}</span>
        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors"
    >
      Sign in with Microsoft
    </button>
  );
} 