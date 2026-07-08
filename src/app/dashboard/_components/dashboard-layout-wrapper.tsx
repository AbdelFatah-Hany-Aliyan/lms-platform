"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { NavbarContent } from "./navbar";

interface DashboardLayoutWrapperProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: "ADMIN" | "STUDENT";
  };
  children: React.ReactNode;
}

export const DashboardLayoutWrapper = ({
  user,
  children,
}: DashboardLayoutWrapperProps) => {
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth >= 768) {
      setIsDesktopOpen(!isDesktopOpen);
    } else {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex overflow-hidden" dir="ltr">

      <aside
        className={`hidden md:flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex-shrink-0 z-20 overflow-hidden
          ${isDesktopOpen ? "w-64" : "w-20"}
        `}
      >
        <Sidebar role={user.role} isSidebarOpen={isDesktopOpen} />
      </aside>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex transition-all duration-300">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-64 h-full bg-white shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {/* زر إغلاق صريح في الأعلى للموبايل */}
            <div className="h-16 flex items-center justify-end px-4 border-b border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 border border-gray-200 transition"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar role={user.role} isSidebarOpen={true} />
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative z-10">

        <header className="h-16 flex-shrink-0 border-b border-gray-200 bg-white flex items-center px-6 z-20 shadow-sm shadow-gray-50/50">

          <button
            onClick={handleToggleSidebar}
            className="p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 border border-gray-200 transition bg-white flex items-center justify-center shadow-sm"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-4" />

          <div className="flex-1 flex items-center justify-end">
            <NavbarContent user={user} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/30 relative">
          {children}
        </main>
      </div>
    </div>
  );
};