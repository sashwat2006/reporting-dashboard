import * as React from "react";

export function Tabs({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col ${className}`} {...props}>
      {children}
    </div>
  );
}

export function TabsList({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex space-x-2 border-b mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`px-4 py-2 rounded-t bg-gray-100 hover:bg-white focus:outline-none ${className}`} {...props}>
      {children}
    </button>
  );
}
