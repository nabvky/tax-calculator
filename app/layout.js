"use client";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
          {/* Sidebar: Responsive */}
          <div
            style={{
              width: isSidebarOpen ? "250px" : "60px",
              transition: "width 0.3s ease",
              flexShrink: 0,
              background: "#f0f0f0",
            }}
          >
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          </div>

          {/* Main Content: Full Width When Sidebar is Collapsed */}
          <div
            style={{
              flexGrow: 1,
              overflowX: "hidden",
              padding: "16px",
              transition: "margin-left 0.3s ease",
            }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
