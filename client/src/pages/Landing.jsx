import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        margin: 0,   
        padding: 0,
        position: "relative",           // ✅ FORCE FULL SCREEN
        top: 0,
        left: 0,
        backgroundImage: "url('/bg_cute.png')", // 👈 FULL BACKGROUND
        backgroundSize: "cover",       // fills screen
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "flex-start",      // 👈 push content to top
        justifyContent: "center",
        paddingTop: "100px",            // 👈 spacing from top
      }}
    >
      {/* TEXT CONTENT */}
      <div style={{ textAlign: "center", marginTop: "100px"}}>
        <h1
          style={{
            color: "#ac77dd",
            fontSize: "50px",
            marginBottom: "10px",
          }}
        >
          TaskZen
        </h1>
        <br></br>
        <p
          style={{
            fontSize: "16px",
            color: "#444",
            marginBottom: "20px",
          }}
        >
          Organize your life with ease  <br />
          Track tasks, manage deadlines, and boost productivity.
        </p>
        <br></br>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "12px 25px",
            borderRadius: "12px",
            border: "none",
            background: "#b88de1",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}

export default Landing;
