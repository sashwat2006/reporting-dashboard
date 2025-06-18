import React from "react";

export function Card({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-2 ${className}`} {...props}>
      {children}
    </div>
  );
}
