"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Basic client-side protection
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("auth_token");
    router.push("/");
  }

  return (
    <div className="flex h-screen bg-[#fafafa] text-black">
      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? "w-16" : "w-64"
        } bg-white border-r border-[#e5e5e5] transition-all duration-300 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#e5e5e5]">
          {!isCollapsed && (
            <span className="font-mono font-bold text-lg tracking-tight">
              X-GENO
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 m-auto"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-2 px-2 overflow-y-auto">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 p-2.5 hover:bg-gray-100 rounded-md font-medium text-sm transition-colors text-black"
            title="Home"
          >
            <Home size={18} />
            {!isCollapsed && <span>Home</span>}
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-3 p-2.5 hover:bg-gray-100 rounded-md font-medium text-sm transition-colors text-gray-600 hover:text-black"
            title="Patients"
          >
            <Users size={18} />
            {!isCollapsed && <span>Patients</span>}
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-3 p-2.5 hover:bg-gray-100 rounded-md font-medium text-sm transition-colors text-gray-600 hover:text-black"
            title="Settings"
          >
            <Settings size={18} />
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </nav>

        <div className="p-4 border-t border-[#e5e5e5]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-100 text-gray-600 hover:text-black rounded-md font-medium text-sm transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-[#e5e5e5] flex items-center px-8 sticky top-0 z-10">
          <h2 className="text-sm font-medium text-gray-500">Dashboard / Overview</h2>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
