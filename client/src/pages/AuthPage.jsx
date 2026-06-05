import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const res = await API.post(endpoint, payload);
      login(res.data.token, res.data.user);
      navigate("/boards",{replace:true});
    } catch (err) {
  console.log(err); // 👈 see real error in console

  setError(
    err.response?.data?.message ||
    err.message ||
    "Server not reachable"
  );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      {/* ONLY FORM PANEL */}
      <div style={rightPanel}>
        <div style={formBox}>
          <h2 style={formTitle}>
            {mode === "login" ? "Welcome back " : "Get started 🚀"}
          </h2>

          <p style={formSub}>
            {mode === "login"
              ? "Sign in to continue to TaskZen"
              : "Create your free TaskZen account"}
          </p>

          {mode === "signup" && (
            <div style={inputGroup}>
              <label style={labelStyle}>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="e.g. Faatina"
                style={inputStyle}
              />
            </div>
          )}

          <div style={inputGroup}>
            <label style={labelStyle}>Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handle}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handle}
              placeholder="••••••••"
              style={inputStyle}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>

          {error && <div style={errorBox}>⚠️ {error}</div>}

          <button onClick={submit} disabled={loading} style={submitBtn}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In →"
              : "Create Account →"}
          </button>

          <div style={divider}>
            <span style={dividerText}>or</span>
          </div>

          <p style={switchText}>
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <span
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
                setForm({ name: "", email: "", password: "" });
              }}
              style={switchLink}
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

const page = {
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #b99ad6, #a18bd6)",
};

const rightPanel = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formBox = {
  width: "100%",
  maxWidth: "420px",
  padding: "40px 30px",
  borderRadius: "24px",

  background: "rgba(255,255,255,0.9)", // ✅ more solid (better contrast)
  boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
};

const formTitle = {
  fontSize: "28px",
  fontWeight: "800",
  textAlign: "center",
  color: "#2d2b55",   // ✅ dark purple (not black)
};

const formSub = {
  textAlign: "center",
  color: "#666",
  marginBottom: "25px",
};

const inputGroup = {
  marginBottom: "16px",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#555",
  marginBottom: "6px",
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  outline: "none",
  boxSizing: "border-box", // ✅ FIX OVERFLOW
};

const submitBtn = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #6a5af9, #8b7cff)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "700",
  marginBottom: "20px",
};

const errorBox = {
  background: "#ffe6e6",
  color: "red",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "10px",
};

const divider = {
  textAlign: "center",
  marginBottom: "10px",
};

const dividerText = {
  color: "#aaa",
};

const switchText = {
  textAlign: "center",
  fontSize: "13px",
};

const switchLink = {
  color: "#6a5af9",
  cursor: "pointer",
  fontWeight: "bold",
};
