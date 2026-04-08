import { useState, useEffect } from "react";
import { getExpenses, getCategories } from "../../services/api";

function ExpensesTab() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category_id: "",
    start_date: "",
    end_date: "",
  });

  // 📡 Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      if (data.status === "success") {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // 📡 Fetch expenses with filters
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const data = await getExpenses(params);
      if (data.status === "success") {
        setExpenses(data.expenses);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ category_id: "", start_date: "", end_date: "" });
  };

  return (
    <>
      {/* 📊 Filters Section */}
      <div 
        className="glass-card" 
        style={{ 
          padding: "24px", 
          marginBottom: "32px", 
          background: "rgba(255,255,255,0.02)",
          maxWidth: "100%" 
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", alignItems: "flex-end" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category</label>
            <select
              className="form-input"
              name="category_id"
              value={filters.category_id}
              onChange={handleFilterChange}
              style={{ appearance: "none", cursor: "pointer", background: "rgba(255, 255, 255, 0.05)", color: "#fff" }}
            >
              <option value="" style={{ background: "#1a1a1a" }}>All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} style={{ background: "#1a1a1a" }}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Start Date</label>
            <input
              className="form-input"
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">End Date</label>
            <input
              className="form-input"
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
            />
          </div>

          <div style={{ display: "flex" }}>
            <button 
              className="social-btn" 
              style={{ margin: 0, padding: "12px", width: "100%", height: "46px" }}
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* 📊 Transactions Section */}
      <div className="dashboard-grid" style={{ display: "grid", gap: "32px" }}>
        <div className="history-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Recent Transactions
            </h3>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p className="auth-subtitle">Loading transactions...</p>
            </div>
          ) : expenses.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="glass-card"
                  style={{
                    padding: "20px",
                    background: "rgba(255,255,255,0.03)",
                    margin: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          marginBottom: "4px",
                          color: "#fff",
                        }}
                      >
                        {exp.description}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            padding: "2px 8px",
                            background:
                              "rgba(139, 92, 246, 0.1)",
                            borderRadius: "10px",
                            color: "var(--secondary)",
                          }}
                        >
                          {exp.category || "General"}
                        </span>

                        <span>•</span>
                        <span>{exp.date}</span>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "var(--primary)",
                      }}
                    >
                      Rs.{exp.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="glass-card"
              style={{
                textAlign: "center",
                padding: "60px 0",
                background: "rgba(255,255,255,0.02)",
                borderStyle: "dashed",
              }}
            >
              <p className="auth-subtitle">
                No transactions found.
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginTop: "8px",
                }}
              >
                Add your first expense using the + button below.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ExpensesTab;
