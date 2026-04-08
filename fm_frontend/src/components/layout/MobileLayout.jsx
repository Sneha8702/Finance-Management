import BottomNavBar from "../navigation/BottomNavBar";

function MobileLayout({ children, activeTab, onTabChange, onAddClick }) {
  return (
    <div
      className="auth-page"
      style={{
        padding: "40px 20px 100px 20px",
        display: "block",
        minHeight: "100vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        {children}
      </div>

      <BottomNavBar 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        onAddClick={onAddClick} 
      />
    </div>
  );
}

export default MobileLayout;
