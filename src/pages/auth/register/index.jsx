import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Style from "../auth.module.css";
import { LineWave } from "react-loader-spinner";
import { register } from "../../../redux/action/user.action";
import { useDispatch } from "react-redux";

import AOS from "aos";
import "aos/dist/aos.css";

const Login = ({ setSocket }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerForm, setRegisterForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleInput = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(register(registerForm, navigate));
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
            Register
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
              Name
            </p>
            <input
              className={Style.inputForm}
              type="text"
              placeholder="Fullname"
              style={{
                borderBottom: "1px solid #232323",
                marginBottom: "30px",
              }}
              value={registerForm.fullname}
              onChange={handleInput}
              name="fullname"
              data-aos="zoom-in-left"
              data-aos-duration="1000"
            />
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
              value={registerForm.email}
              onChange={handleInput}
              name="email"
              data-aos="zoom-in-left"
              data-aos-duration="1000"
            />
            <p
              style={{ color: "#848484", margin: "0px" }}
              data-aos="zoom-in-left"
              data-aos-duration="1000"
            >
              Phone
            </p>
            <input
              className={Style.inputForm}
              type="text"
              placeholder="Your Phone"
              style={{
                borderBottom: "1px solid #232323",
                marginBottom: "30px",
              }}
              value={registerForm.phone}
              onChange={handleInput}
              name="phone"
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
                value={registerForm.password}
                onChange={handleInput}
                data-aos="zoom-in-right"
                data-aos-duration="1000"
              />
            </div>

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
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
