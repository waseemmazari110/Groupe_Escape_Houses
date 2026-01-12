"use client";

import { ReactNode } from "react";
import { Shield } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
}

export default function AdminLayout({ 
  children, 
  title = "Admin Portal",
  showHeader = true 
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {showHeader && (
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    {title}
                  </h1>
                  <p className="text-xs text-slate-500">
                    Group Escape Houses Administration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Group Escape Houses - Admin Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
