import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Style from "../auth.module.css";
import io from "socket.io-client";
import swal from "sweetalert";
// import app from "../../../firebase";
// import { v4 as uuid } from "uuid";
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// const auth = getAuth(app);
import { LineWave } from "react-loader-spinner";

import AOS from "aos";
import "aos/dist/aos.css";

const Login = ({ setSocket }) => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  //   const handleGoogleLogin = async () => {
  //     try {
  //       const newUuid = uuid();
  //       const provider = new GoogleAuthProvider();
  //       const result = await signInWithPopup(auth, provider);
  //       console.log(result.user);
  //       const user = {
  //         id: newUuid,
  //         email: result.user.email,
  //         name: result.user.displayName,
  //       };
  //       const token = result.user.accessToken;
  //       const id = newUuid;
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("user", JSON.stringify(user));
  //       localStorage.setItem("id", id);
  //       const socket = io(`${process.env.REACT_APP_BACKEND_URL}`, {
  //         query: {
  //           token: token,
  //         },
  //         transports: ["websocket", "polling"],
  //       });
  //       setSocket(socket);
  //       swal({
  //         title: "Login success",
  //         text: `Welcome, ${user.name}`,
  //         icon: "success",
  //       });
  //       navigate("/");
  //     } catch (err) {
  //       const errorCode = err.code;
  //       const errorMessage = err.message;
  //       const credential = GoogleAuthProvider.credentialFromError(err);
  //       console.log(errorCode, errorMessage, credential);
  //       swal({
  //         title: "Register failed",
  //         icon: "error",
  //       });
  //     }
  //   };
  const handleInput = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/v1/user/login`, loginForm)
      .then((res) => {
        const token = res.data.data.token;
        const id = res.data.data.user_id;
        const user = {
          id: res.data.data.user_id,
          name: res.data.data.fullname,
          email: res.data.data.email,
          phone: res.data.data.phone,
        };
        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        localStorage.setItem("user", JSON.stringify(user));
        const socket = io(`${process.env.REACT_APP_BACKEND_URL}`, {
          query: {
            token: token,
          },
          transports: ["websocket", "polling"],
        });
        setSocket(socket);
        swal({
          title: "Login Success",
          text: `Welcome, ${user.name}`,
          icon: "success",
        });
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "Failed",
          icon: "warning",
        });
      });
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  if (loading) {
    return (
      <div
        style={{
          paddingLeft: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#202c33",
        }}
      >
        <LineWave
          height="145"
          width="140"
          color="white"
          ariaLabel="line-wave"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          firstLineColor=""
          middleLineColor=""
          lastLineColor=""
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={`container-fluid d-flex justify-content-center align-items-center w-100 ${Style.containerLogin}`}
      >
        <div
          className={`d-flex flex-column justify-content-center align-items-center  ${Style.loginContent}`}
        >
          <h3
            style={{
              color: "#005c4b",
              marginBottom: "30px",
              marginTop: "20px",
            }}
            data-aos="zoom-in-left"
            data-aos-duration="1000"
          >
            Login
          </h3>
          <div style={{ display: "flex", width: "80%" }}>
            <p
              data-aos="zoom-in-right"
              data-aos-duration="1000"
              style={{ marginBottom: "30px" }}
            >
              Hi, Welcome back!
            </p>
          </div>
          <form style={{ width: "80%" }} onSubmit={handleSubmit}>
            <p
              style={{ color: "#848484", margin: "0px" }}
              data-aos="zoom-in-left"
              data-aos-duration="1000"
            >
              Email
            </p>
            <input
              className={Style.inputForm}
              type="email"
              placeholder="Your email"
              style={{
                borderBottom: "1px solid #232323",
                marginBottom: "30px",
              }}
              name="email"
              value={loginForm.email}
              onChange={handleInput}
              data-aos="zoom-in-left"
              data-aos-duration="1000"
            />
            <p
              style={{ color: "#848484", margin: "0px" }}
              data-aos="zoom-in-right"
              data-aos-duration="1000"
            >
              Password
            </p>
            <div
              style={{
                display: "flex",
                width: "100%",
                borderBottom: "1px solid #232323",
                marginBottom: "30px",
              }}
            >
              <input
                className={Style.inputForm}
                name="password"
                type="password"
                placeholder="Your password"
                value={loginForm.password}
                onChange={handleInput}
                data-aos="zoom-in-right"
                data-aos-duration="1000"
              />
            </div>
            <span
              style={{
                display: "flex",
                color: "#005c4b",
                fontSize: "16px",
                width: "100%",
                justifyContent: "flex-end",
                marginBottom: "30px",
              }}
              data-aos="zoom-in-left"
              data-aos-duration="1000"
            >
              Forgot password?
            </span>
            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#005c4b",
                color: "#FFF",
                border: "none",
                borderRadius: "70px",
                padding: "20px",
                marginBottom: "20px",
              }}
              data-aos="zoom-in-right"
              data-aos-duration="1000"
            >
              Login
            </button>
          </form>

          <div style={{ display: "flex" }}>
            <p data-aos="zoom-in-left" data-aos-duration="1000">
              Don’t have an account?&nbsp;
            </p>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <p
                style={{ color: "#005c4b" }}
                data-aos="zoom-in-right"
                data-aos-duration="1000"
              >
                Sign Up
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
