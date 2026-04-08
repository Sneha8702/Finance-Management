import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import AddExpenseModal from "../components/AddExpenseModal";
import MobileLayout from "../components/layout/MobileLayout";

// Tab Imports
import HomeTab from "./tabs/HomeTab";
import StatsTab from "./tabs/StatsTab";
import ExpensesTab from "./tabs/ExpensesTab";
import ProfileTab from "./tabs/ProfileTab";

function Dashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("expenses");

  // 🚪 Logout
  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  // 🔐 Check auth & Load Data
  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/");
    } else {
      setUsername(localStorage.getItem("username") || "User");
    }
  }, [navigate]);

  const [refreshKey, setRefreshKey] = useState(0);

  // 📑 Render Active Tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab />;
      case "stats":
        return <StatsTab />;
      case "expenses":
        return <ExpensesTab key={refreshKey} />;
      case "profile":
        return <ProfileTab />;
      default:
        return <ExpensesTab key={refreshKey} />;
    }
  };

  return (
    <MobileLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      onAddClick={() => setShowModal(true)}
    >
      {/* 🔷 Global Dashboard Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h2
            className="auth-title"
            style={{ textAlign: "left", marginBottom: "4px" }}
          >
            Welcome back,{" "}
            <span style={{ color: "var(--secondary)" }}>
              {username}
            </span>
            !
          </h2>
          <p className="auth-subtitle" style={{ textAlign: "left" }}>
            Here is your latest spending analysis.
          </p>
        </div>

        <button
          className="social-btn"
          style={{ padding: "12px 24px" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* 📑 Dynamic Tab Content */}
      <div key={activeTab}>
        {renderTabContent()}
      </div>

      {/* 🪟 Reusable Modal */}
      <AddExpenseModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setRefreshKey(prev => prev + 1);
        }}
      />
    </MobileLayout>
  );
}

export default Dashboard;