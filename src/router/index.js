import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import io from "socket.io-client";
import swal from "sweetalert";
import Login from "../pages/auth/login/index.jsx";
import Register from "../pages/auth/register/index.jsx";
import Main from "../pages/home/index";

const Router = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!socket && token) {
      const res = io(`${process.env.REACT_APP_BACKEND_URL}`, {
        query: {
          token: token,
        },
        transports: ["websocket", "polling"],
      });
      setSocket(res);
    }
  }, [socket]);

  const Auth = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      swal({
        title: "Denied!",
        text: `Access Denied, Please Login!`,
        icon: "error",
      });
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setSocket={setSocket} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Auth>
              <Main socket={socket} />
            </Auth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
