function BottomNavBar({ activeTab, onTabChange, onAddClick }) {
  const tabs = [
    { id: "home", label: "Home", icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
    )},
    { id: "stats", label: "Stats", icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
    )},
    { id: "add", isAction: true },
    { id: "expenses", label: "Expenses", icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
    )},
    { id: "profile", label: "Profile", icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    )},
  ];

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      background: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(12px)",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      borderTopLeftRadius: "24px",
      borderTopRightRadius: "24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 24px",
      zIndex: 100,
    }}>
      {/* Nav Left */}
      <div style={{ display: "flex", gap: "24px", flex: 1, justifyContent: "space-around" }}>
        {tabs.slice(0, 2).map((tab) => (
          <div 
            key={tab.id}
            onClick={() => onTabChange(tab.id)} 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              color: activeTab === tab.id ? "var(--primary)" : "var(--text-muted)", 
              cursor: "pointer", 
              transition: "color 0.2s" 
            }}
          >
            {tab.icon}
            <span style={{ fontSize: "11px", marginTop: "4px", fontWeight: "500" }}>{tab.label}</span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div style={{ flex: 0.5, display: "flex", justifyContent: "center" }}>
        <button
          onClick={onAddClick}
          style={{
            background: "var(--primary)",
            border: "none",
            borderRadius: "50%",
            width: "56px",
            height: "56px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
            color: "white",
            fontSize: "28px",
            fontWeight: "bold",
            transform: "translateY(-16px)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-18px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(139, 92, 246, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(-16px)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(139, 92, 246, 0.3)";
          }}
        >
          +
        </button>
      </div>

      {/* Nav Right */}
      <div style={{ display: "flex", gap: "24px", flex: 1, justifyContent: "space-around" }}>
        {tabs.slice(3).map((tab) => (
          <div 
            key={tab.id}
            onClick={() => onTabChange(tab.id)} 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              color: activeTab === tab.id ? "var(--primary)" : "var(--text-muted)", 
              cursor: "pointer", 
              transition: "color 0.2s" 
            }}
          >
            {tab.icon}
            <span style={{ fontSize: "11px", marginTop: "4px", fontWeight: "500" }}>{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BottomNavBar;
