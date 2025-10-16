"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Drawer button for mobile */}
      <button
        className="md:hidden absolute top-4 left-4 z-20 bg-white p-2 rounded shadow"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open sidebar"
      >
        ☰
      </button>
      {/* Drawer for mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-30 flex">
          <div className="bg-white w-64 h-full shadow-lg">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setDrawerOpen(false)}
          />
        </div>
      )}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
