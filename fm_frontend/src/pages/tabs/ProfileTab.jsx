import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Shield, Mail, Trash2 } from "lucide-react";

function ProfileTab({ username = "User" }) {
  const { theme, toggleTheme } = useTheme();

  const handleDeleteAccount = () => {
    alert("Delete Account functionality is coming soon!");
  };

  return (
    <div className="glass-card" style={{ 
      padding: "40px 24px", 
      textAlign: "center", 
      background: "var(--glass-bg)",
      margin: "0 auto",
      boxShadow: "var(--shadow)"
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

      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "var(--text-main)" }}>
        {username}
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "40px" }}>
        Premium Member
      </p>

      <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* 🌓 Theme Toggle */}
        <div 
          onClick={toggleTheme}
          style={{ 
            padding: "16px", 
            background: "var(--input-bg)", 
            borderRadius: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            border: "1px solid var(--glass-border)",
            transition: "var(--transition)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {theme === "dark" ? <Moon size={20} color="var(--primary)" /> : <Sun size={20} color="var(--accent)" />}
            <span style={{ color: "var(--text-main)", fontWeight: "600", fontSize: "14px" }}>
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
          <div style={{ 
            width: "44px", 
            height: "24px", 
            background: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            borderRadius: "20px",
            position: "relative",
            padding: "2px"
          }}>
            <div style={{ 
              width: "20px", 
              height: "20px", 
              background: theme === "dark" ? "var(--primary)" : "var(--accent)", 
              borderRadius: "50%",
              position: "absolute",
              right: theme === "dark" ? "2px" : "auto",
              left: theme === "light" ? "2px" : "auto",
              transition: "var(--transition)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
            }} />
          </div>
        </div>

        <div style={{ 
          padding: "16px", 
          background: "var(--input-bg)", 
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid var(--glass-border)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Shield size={20} color="var(--text-muted)" />
            <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Account ID</span>
          </div>
          <span style={{ color: "var(--text-main)", fontWeight: "600", fontSize: "14px" }}>#882{username.length}</span>
        </div>

        <div style={{ 
          padding: "16px", 
          background: "var(--input-bg)", 
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid var(--glass-border)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Mail size={20} color="var(--text-muted)" />
            <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Email</span>
          </div>
          <span style={{ color: "var(--text-main)", fontWeight: "600", fontSize: "14px" }}>{username.toLowerCase()}@example.com</span>
        </div>
      </div>

      <button 
        onClick={handleDeleteAccount}
        style={{ 
          marginTop: "60px",
          background: "rgba(239, 68, 68, 0.1)",
          color: "#ef4444",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          padding: "16px",
          borderRadius: "16px",
          width: "100%",
          cursor: "pointer",
          fontWeight: "600",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
        }}
      >
        <Trash2 size={18} />
        Delete Account
      </button>

      <p style={{ marginTop: "12px", color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>
        v1.0.4 • Beta
      </p>
    </div>
  );
}

export default ProfileTab;
