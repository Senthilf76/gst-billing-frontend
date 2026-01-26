import { useState, useEffect } from "react";
import "./App.css";

import InvoicePage from "./pages/InvoicePage";
import GSTReportPage from "./pages/GSTReportPage";
import TermsPage from "./components/TermsPage";
import Login from "./pages/login";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  const [loggedIn, setLoggedIn] = useState(null); // null = checking
  const [role, setRole] = useState(null);
  const [activePage, setActivePage] = useState("invoice");

  const API_URL = process.env.REACT_APP_API_URL;

  // 🔑 TERMS STORED GLOBALLY
  const [terms, setTerms] = useState([
    "Customer will be billed after indicating the acceptance of this quote.",
    "Payment of 70% will be due prior to delivery of goods.",
    "Pinned Glass white will be fixed with 4mm thickness.",
    "Extra charges applicable for colour Glass.",
    "Mesh charges Rs 80 per sqft is applicable.",
  ]);

  // 🔐 VERIFY LOGIN ON APP LOAD
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    // ❌ Missing env or auth → force login
    if (!API_URL || !token || !savedRole || savedRole === "null") {
      localStorage.clear();
      setLoggedIn(false);
      setRole(null);
      return;
    }

    // ✅ Verify token with backend
    fetch(`${API_URL}/api/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then(() => {
        setLoggedIn(true);
        setRole(savedRole);
      })
      .catch(() => {
        localStorage.clear();
        setLoggedIn(false);
        setRole(null);
      });
  }, [API_URL]);

  // 🔓 AFTER SUCCESSFUL LOGIN
  const handleLogin = () => {
    const savedRole = localStorage.getItem("role");
    setLoggedIn(true);
    setRole(savedRole);
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setRole(null);
  };

  // ⏳ WAIT FOR AUTH CHECK
  if (loggedIn === null) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  // 🔒 FORCE LOGIN FIRST
  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Navbar onLogout={handleLogout} />

      <div style={{ display: "flex" }}>
        <Sidebar
          role={role}
          active={activePage}
          setActive={setActivePage}
        />

        <div style={{ flex: 1, padding: "20px" }}>
          {activePage === "invoice" && <InvoicePage terms={terms} />}

          {activePage === "terms" && (
            <TermsPage terms={terms} setTerms={setTerms} />
          )}

          {/* 👑 ADMIN ONLY */}
          {activePage === "gst" && role === "admin" && (
            <GSTReportPage />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
