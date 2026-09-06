"use client";

import { useAuth } from "@/app/context/AuthContext";

export default function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-[#1E293B] flex flex-wrap justify-between items-center p-8 gap-4">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button type="button" onClick={onMenuToggle} className="md:hidden text-[#F8FAFC]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        )}
        <span className="text-2xl font-bold text-white">AI Monitoring Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <button
            onClick={() => logout()}
            className="bg-[#6366F1] text-sm text-[#F8FAFC] hover:bg-[#6366F1]/80 p-2 rounded-lg"
          >
            Logout
          </button>
        )}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-[#6366F1] w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
        <span className="text-lg font-semibold text-white">{user?.username ?? "Guest"}</span>
      </div>
    </header>
  );
}
