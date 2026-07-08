"use client";

import { signOut } from "next-auth/react";
import { LogOut, User, Bell } from "lucide-react";

interface NavbarContentProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
}

export const NavbarContent = ({ user }: NavbarContentProps) => {
  return (
    <div className="flex items-center gap-x-3 md:gap-x-5 ml-auto" dir="ltr">
      
      {/* جرس الإشعارات */}
      <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
      </button>

      {/* فاصل طولي مخفي على الموبايل */}
      <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

      {/* منطقة البروفايل */}
      <div className="flex items-center gap-x-3">
        {/* نصوص الاسم والإيميل */}
        <div className="flex flex-col text-right hidden md:flex">
          <span className="text-sm font-bold text-gray-900 leading-none mb-1">
            {user.name || "User"}
          </span>
          <span className="text-xs text-gray-500 leading-none">
            {user.email}
          </span>
        </div>

        {/* الصورة الرمزية */}
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white outline outline-1 outline-gray-200">
          {user.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
        </div>

        {/* زر تسجيل الخروج */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-2.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition sm:ml-2"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};