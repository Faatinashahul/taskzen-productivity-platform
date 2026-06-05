import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { name: "Boards",   path: "/boards",         icon: "🗂️" },
    { name: "Notes",    path: "/inbox",     icon: "💡" },
    { name: "Planner",  path: "/planner",   icon: "📅" },
    { name: "Activity", path: "/activity",  icon: "🔔" },
    { name: "Account",  path: "/account",   icon: "👤" },
  ];

  return (
    <div style={navStyle}>
      {items.map((item) => {
        const active = location.pathname === item.path;
        return (
          <div
            key={item.name}
            onClick={() => navigate(item.path)}
            style={{ ...navItem, color: active ? "#fff" : "rgba(255,255,255,0.5)" }}
          >
            <div style={{
              ...iconBubble,
              background: active ? "rgba(255,255,255,0.2)" : "transparent",
            }}>
              <span style={{ fontSize: "23px" }}>{item.icon}</span>
            </div>
            <span style={{ fontSize: "15px", marginTop: "2px", fontWeight: active ? "700" : "400" }}>
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default Navbar;

const navStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "space-around",
  background: "#b99ad6",
  padding: "6px 0 10px",
  zIndex: 1000,
  boxShadow: "0 -4px 20px rgba(0,0,0,0.25)",
};

const navItem = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
  transition: "0.2s",
  flex: 1,
};

const iconBubble = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "0.2s",
};
