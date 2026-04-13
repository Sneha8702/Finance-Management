import { useState, useEffect } from "react";

function ProfileTab({ username = "User" }) {
  const handleDeleteAccount = () => {
    // Placeholder for future functionality
    alert("Delete Account functionality is coming soon!");
  };

  return (
    <div className="glass-card" style={{ 
      padding: "40px 24px", 
      textAlign: "center", 
      background: "rgba(255,255,255,0.02)",
      maxWidth: "500px",
      margin: "0 auto"
    }}>
      <div style={{ 
        width: "100px", 
        height: "100px", 
        background: "linear-gradient(135deg, var(--primary), var(--secondary))", 
        borderRadius: "50%", 
        margin: "0 auto 24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "40px",
        fontWeight: "700",
        color: "white",
        boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)"
      }}>
        {username.charAt(0).toUpperCase()}
      </div>

      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "#fff" }}>
        {username}
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "40px" }}>
        Premium Member
      </p>

      <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ 
          padding: "16px", 
          background: "rgba(255,255,255,0.03)", 
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Account ID</span>
          <span style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>#882{username.length}</span>
        </div>

        <div style={{ 
          padding: "16px", 
          background: "rgba(255,255,255,0.03)", 
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Email</span>
          <span style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>{username.toLowerCase()}@example.com</span>
        </div>
      </div>

      <button 
        onClick={handleDeleteAccount}
        style={{ 
          marginTop: "60px",
          background: "rgba(239, 68, 68, 0.1)",
          color: "#fca5a5",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          padding: "16px",
          borderRadius: "16px",
          width: "100%",
          cursor: "pointer",
          fontWeight: "600",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
        }}
      >
        Delete Account
      </button>

      <p style={{ marginTop: "12px", color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>
        v1.0.4 • Beta
      </p>
    </div>
  );
}

export default ProfileTab;
