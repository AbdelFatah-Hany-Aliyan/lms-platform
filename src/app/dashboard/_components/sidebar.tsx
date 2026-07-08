"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, GraduationCap, Settings, Compass } from "lucide-react";

interface SidebarProps {
  role: "ADMIN" | "STUDENT";
  isSidebarOpen: boolean;
}

export const Sidebar = ({ role, isSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const adminRoutes = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: BookOpen, label: "Courses", href: "/dashboard/admin/courses" },
    { icon: Users, label: "Students", href: "/dashboard/admin/students" },
  ];

  const studentRoutes = [
    { icon: GraduationCap, label: "My Learning", href: "/dashboard/student/my-courses" },
    { icon: Compass, label: "Browse Courses", href: "/dashboard/student/explore" },
  ];

  const routes = role === "ADMIN" ? adminRoutes : studentRoutes;

  return (
    <div className="flex flex-col h-full bg-white text-gray-700 select-none overflow-hidden">
      <div className={`h-16 min-h-[4rem] flex items-center border-b border-gray-100 bg-white
        ${isSidebarOpen ? "px-6 gap-x-3 justify-start" : "px-0 justify-center"}
      `}>
        <div className="w-9 h-9 min-w-[36px] rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-100">
          L
        </div>
        {isSidebarOpen && (
          <span className="font-extrabold text-gray-900 text-xl tracking-tight whitespace-nowrap">
            LMS<span className="text-blue-600">Pro</span>
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 gap-y-1.5 overflow-y-auto overflow-x-hidden">
        {routes.map((route) => {
          const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
          const Icon = route.icon;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-x-3 py-3 rounded-xl transition-all duration-200 group relative
                ${isSidebarOpen ? "px-3 justify-start" : "px-0 justify-center"}
                ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
              `}
              title={!isSidebarOpen ? route.label : undefined}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
              
              {isSidebarOpen && (
                <span className="truncate font-bold text-sm">
                  {route.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-100 bg-white">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-x-3 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all group
            ${isSidebarOpen ? "px-3 justify-start" : "px-0 justify-center"}
          `}
          title={!isSidebarOpen ? "Settings" : undefined}
        >
          <Settings className="w-5 h-5 min-w-[20px] text-gray-400 group-hover:text-gray-600" />
          {isSidebarOpen && (
            <span className="truncate font-bold text-sm">
              Settings
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};