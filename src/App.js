import { useState, useEffect } from "react";
import "./App.css";

import InvoicePage from "./pages/InvoicePage";
import GSTReportPage from "./pages/GSTReportPage";
import TermsPage from "./components/TermsPage";
import Login from "./pages/login";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [activePage, setActivePage] = useState("invoice");

  // 🔑 TERMS STORED GLOBALLY
  const [terms, setTerms] = useState([
    "Customer will be billed after indicating the acceptance of this quote.",
    "Payment of 70% will be due prior to delivery of goods.",
    "Pinned Glass white will be fixed with 4mm thickness.",
    "Extra charges applicable for colour Glass.",
    "Mesh charges Rs 80 per sqft is applicable.",
  ]);

  // 🔐 CHECK LOGIN ON APP LOAD
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (token && savedRole) {
      setLoggedIn(true);
      setRole(savedRole);
    } else {
      localStorage.clear();
      setLoggedIn(false);
      setRole(null);
    }
  }, []);

  // 🔓 AFTER SUCCESSFUL LOGIN
  const handleLogin = () => {
    setLoggedIn(true);
    setRole(localStorage.getItem("role"));
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setRole(null);
  };

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
          {activePage === "invoice" && (
            <InvoicePage terms={terms} />
          )}

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
