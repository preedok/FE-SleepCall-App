import React, { useState, useEffect } from "react";
import Router from "./router";
import logo from "./assets/wa.png";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  if (loading) {
    return (
      <div
        className="d-flex"
        style={{
          backgroundColor: "#202c33",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <img src={logo} alt="Logo" width="150px" />
      </div>
    );
  }
  return (
    <>
      <Router />
    </>
  );
}

export default App;
