import React from "react";
import { useThemeStore } from "../Store/useThemeStore";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children, showSidebar = false }) => {
  const { theme } = useThemeStore();

  return (
    <div data-theme={theme} className="layout-root min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        .layout-root {
          background: radial-gradient(120% 60% at 15% 0%, #142219 0%, #0B1410 45%), #0B1410;
          color: #F3F1EA;
          font-family: 'Inter', sans-serif;
          transition: background 0.2s ease, color 0.2s ease;
        }
      `}</style>

      <div className="flex min-h-screen">
        {/* Sidebar — fixed positioned; reserves space via padding on the content column below */}
        {showSidebar && <Sidebar />}

        {/* Main Section */}
        <div className={`flex min-w-0 flex-1 flex-col ${showSidebar ? "lg:pl-72" : ""}`}>
          {/* Navbar */}
          <header className="sticky top-0 z-30">
            <Navbar />
          </header>

          {/* Page Content */}
          <main className="relative flex-1 overflow-y-auto">
            <div className="min-h-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;