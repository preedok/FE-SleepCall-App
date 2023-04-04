import React, { useEffect, useState } from "react";
import axios from "axios";
import ClickAwayListener from "react-click-away-listener";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import searchicon from "../../assets/search.svg";
import logo from "../../assets/wa.png";
import avatar from "../../assets/dummy.jpg";

import logout from "../../assets/setting.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./main.module.css";
import { LineWave } from "react-loader-spinner";

import AOS from "aos";
import "aos/dist/aos.css";

const Main = ({ socket }) => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friend, setFriend] = useState({});

  const [popup, setPopup] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  const [myProfile, setMyProfile] = useState(false);
  const [friendProfile, setFriendProfile] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState();
  const [photo, setPhoto] = useState();
  const [preview, setPreview] = useState();

  const [isLogout, setIsLogout] = useState(false);

  useEffect(() => {
    const { id } = JSON.parse(localStorage.getItem("user"));
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/user/${id}`)
      .then((res) => {
        const user = res.data.data;
        setUser(user);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        const data = res.data.data;
        setFriends(data);
      });
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("private-msg-BE", (message) => {
        setMessages((current) => [...current, message]);
      });
    }
  }, [socket]);

  useEffect(() => {
    setMessages([]);
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/chat/${friend.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const result = res.data.data;
        setMessages(result);
      });
  }, [friend]);

  const selectFriend = (friend) => {
    setFriend(friend);
    setChatActive(true);
    setFriendProfile(false);
  };

  const handleInput = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    setPhoto(e.target.files[0]);
    setPreview([URL.createObjectURL(e.target.files[0])]);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    if (editForm.fullname) {
      formData.append("fullname", editForm.fullname);
    }
    if (editForm.phone) {
      formData.append("phone", editForm.phone);
    }
    if (editForm.username) {
      formData.append("username", editForm.username);
    }
    if (editForm.bio) {
      formData.append("bio", editForm.bio);
    }
    if (photo) {
      formData.append("avatar", photo);
    }

    await axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/user/${user.user_id}`,
        formData
      )
      .then((res) => {
        swal({
          title: "Account Updated",
          text: `You have just updated your account`,
          icon: "success",
        });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setEditMode(false);
    navigate("/");
  };

  const handleChat = (e) => {
    setMessage(e.target.value);
  };

  const handleMessage = () => {
    console.log(messages);
    if (socket && message && friend.user_id) {
      socket.emit(
        "private-msg",
        {
          receiver: friend.user_id,
          msg: message,
        },
        (message) => {
          setMessages((current) => [...current, message]);
        }
      );
      setMessage("");
    } else {
      alert("Error");
    }
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      if (socket && message && friend.user_id) {
        socket.emit(
          "private-msg",
          {
            receiver: friend.user_id,
            msg: message,
          },
          (message) => {
            setMessages((current) => [...current, message]);
          }
        );
        setMessage("");
      } else {
        alert("Error");
      }
    }
  };

  const deleteChat = (messageId) => {
    const token = localStorage.getItem("token");
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/chat/${messageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    swal({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
      .then((res) => {
        const updatedMessages = messages.filter(
          (message) => message.message_id !== messageId
        );
        setMessages(updatedMessages);
        console.log(updatedMessages);

        swal({
          title: "Delete message success",
          text: `You have just delete your message`,
          icon: "success",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    swal({
      title: "Log Out ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (confirm) => {
      if (confirm) {
        axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/v1/user/offline/${user.user_id}`
        );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("persist:data");

        setIsLogout(true);
      }
    });
  };

  useEffect(() => {
    if (isLogout) {
      swal({
        title: "Log Out Success",
        icon: "success",
      });
      navigate("/login");
    }
  }, [isLogout, navigate]);

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
    <body className={styles.body}>
      {myProfile ? (
        <aside
          className={`col-3 ${styles.profile}`}
          data-aos="zoom-in-left"
          data-aos-duration="1000"
        >
          <button
            onClick={() => {
              setMyProfile(false);
              setPopup(false);
              setEditMode(false);
              setEditForm();
              setPreview();
            }}
            className={styles["back-btn"]}
          >
            <h3 style={{ color: "#005c4b" }}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </h3>
          </button>

          <div
            className={styles["profile-top"]}
            data-aos="zoom-in-right"
            data-aos-duration="1000"
          >
            {editMode ? (
              <>
                <img
                  src={preview ? preview : user.avatar ? user.avatar : avatar}
                  alt=""
                />
                <label htmlFor="photo" className={styles["avatar-btn"]}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-pencil-square"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path
                      fill-rule="evenodd"
                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                    />
                  </svg>
                </label>
                <input
                  onChange={handleFile}
                  id="photo"
                  name="photo"
                  type="file"
                  hidden
                />
                <input
                  onChange={handleInput}
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={user.fullname}
                  className={styles["name-input"]}
                  style={{
                    background: "none",
                    color: "white",
                    textAlign: "center",
                    fontSize: "20px",
                  }}
                />
              </>
            ) : (
              <>
                <img src={user.avatar ? user.avatar : avatar} alt="" />
                <h4 className="text-white">{user.username}</h4>
              </>
            )}
          </div>

          <form className="w-100 m-0">
            <div
              className={styles["profile-info"]}
              data-aos="zoom-in-left"
              data-aos-duration="1000"
            >
              <h5 className="mb-3">Account</h5>
              <hr className="text-white mb-4" />
              <small>phone number</small>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder={user.phone}
                  onChange={handleInput}
                />
              ) : (
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={user.phone}
                  disabled
                />
              )}

              <hr className="text-white" />
              <hr className="my-3" />
              <small>username</small>
              {editMode ? (
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder={user.username ? user.username : "Not set"}
                  onChange={handleInput}
                  className="text-white"
                />
              ) : (
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder={user.username ? user.username : "Not set"}
                  className="text-white"
                />
              )}

              <hr className="text-white" />
              <hr className="my-3" />
              <small>Bio</small>
              {editMode ? (
                <input
                  type="text"
                  name="bio"
                  id="bio"
                  placeholder={user.bio ? user.bio : "I'm using Whatapp"}
                  onChange={handleInput}
                />
              ) : (
                <input
                  type="text"
                  name="bio"
                  id="bio"
                  value={user.bio ? user.bio : "I'm using Whatapp"}
                />
              )}

              <hr className="text-white" />
            </div>

            <div className={styles.options}>
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className={`mb-3 ${styles["edit-btn"]}`}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className={styles["delete-btn"]}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className={`mb-3 ${styles["edit-btn"]}`}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </form>
        </aside>
      ) : (
        <aside className={`col-3 ${styles.sidemenu}`}>
          <div className={`col-12 mb-3 ${styles.sideheader}`}>
            <div
              onClick={() => {
                setMyProfile(true);
              }}
              style={{ cursor: "pointer" }}
              className="me-5"
            >
              <img
                style={{
                  backgroundColor: "white",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid green",
                }}
                width={45}
                height={45}
                src={user.avatar ? user.avatar : avatar}
              />
              <span
                style={{ fontSize: "20px", fontWeight: "600" }}
                className="text-white ms-2"
              >
                {user.username}
              </span>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="27"
              fill="currentColor"
              class="bi bi-people-fill text-white"
              viewBox="0 0 16 16"
            >
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              class="bi bi-arrow-repeat text-white"
              viewBox="0 0 16 16"
            >
              <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
              <path
                fill-rule="evenodd"
                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-chat-left-dots-fill text-white"
              viewBox="0 0 16 16"
            >
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>

            <button onClick={() => setPopup(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-three-dots-vertical text-white"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
            </button>
          </div>

          {popup && (
            <ClickAwayListener onClickAway={() => setPopup(false)}>
              <div className={styles.popmenu}>
                <div onClick={handleLogout} className={styles.popitem}>
                  <img src={logout} alt="" />
                  <h6>Log Out</h6>
                </div>
              </div>
            </ClickAwayListener>
          )}

          <div className={`col-12 mb-3 ${styles.searchbar}`}>
            <img src={searchicon} alt="" />
            <input placeholder="Search..." />
          </div>

          <section className={`col-12 ${styles["chat-list"]}`}>
            {friends &&
              friends.map((item) => (
                <div
                  onClick={() => selectFriend(item)}
                  className={`col-12 ${styles["chat-bubble"]}`}
                >
                  <img src={item.avatar ? item.avatar : avatar} alt="" />
                  <div className={styles["chat-info"]}>
                    <div className="d-flex">
                      <h6 className="text-white">
                        {item.username ? item.username : "Nama Teman"}
                      </h6>
                    </div>

                    <small className="text-white">
                      Tekan untuk membuka chat
                    </small>
                  </div>
                </div>
              ))}
          </section>
        </aside>
      )}

      {!chatActive ? (
        <main
          className={`col-9 ${styles.main}`}
          data-aos="zoom-in-left"
          data-aos-duration="1000"
        >
          <div className={styles.landing}>
            <img width={150} height={150} src={logo} alt="" />
            <h1>Sleep Call App</h1>
            <p>
              Kirim dan terima pesan tanpa perlu menghubungkan telepon anda ke
              Internet.
            </p>
          </div>
        </main>
      ) : (
        <main
          className={
            friendProfile
              ? `col-6 ${styles.chatroom}`
              : `col-9 ${styles.chatroom}`
          }
        >
          <header className={styles.chatheader}>
            <img
              onClick={() => setFriendProfile(true)}
              src={friend.avatar ? friend.avatar : avatar}
              alt=""
            />
            <div className={styles["friend-header"]}>
              <h4 className="text-white" onClick={() => setFriendProfile(true)}>
                {friend.username ? friend.username : "Nama Teman"}
              </h4>

              {friend.status === 0 ? (
                <h6 className="text-danger">Offline</h6>
              ) : (
                <h6 style={{ color: "rgb(22, 255, 1)" }}>Online</h6>
              )}
            </div>
          </header>

          <section
            className={styles.chatbody}
            data-aos="zoom-in-left"
            data-aos-duration="1000"
          >
            {messages &&
              messages.map((item) =>
                user.user_id === item.sender ? (
                  <>
                    <p className={styles["chat-right"]}>
                      <sub>
                        {item.created_at
                          ? `${new Date(item.created_at).getHours()}:${new Date(
                              item.created_at
                            ).getMinutes()}`
                          : item.date}{" "}
                      </sub>
                      {item.message}
                    </p>
                    <span
                      style={{ cursor: "pointer", marginTop: "-10px" }}
                      className="text-danger pointer mb-4 ms-auto"
                      onClick={() => deleteChat(item.message_id)}
                    >
                      Delete
                    </span>
                  </>
                ) : (
                  <p className={styles["chat-left"]}>
                    {item.message}
                    <sub>
                      {item.created_at
                        ? `${new Date(item.created_at).getHours()}:${new Date(
                            item.created_at
                          ).getMinutes()}`
                        : `${new Date(item.date).getHours()}:${new Date(
                            item.date
                          ).getMinutes()}`}{" "}
                    </sub>
                  </p>
                )
              )}
          </section>

          <div className={styles.chatfooter}>
            <div className={styles.chatbox}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-emoji-smile text-white me-2 ms-4"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                fill="currentColor"
                class="bi bi-folder2-open text-white me-3"
                viewBox="0 0 16 16"
              >
                <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
              </svg>
              <input
                placeholder="Type a message..."
                type="text"
                value={message}
                onChange={handleChat}
                onKeyDown={handleEnterKey}
                className="text-white"
              />
              <input id="fileinput" name="fileinput" type="file" hidden />
              <button onClick={handleMessage} className={styles["send-btn"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  class="bi bi-send-plus text-white me-3"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z" />
                  <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z" />
                </svg>
              </button>
            </div>
          </div>
        </main>
      )}

      {friendProfile && (
        <main
          className={`col-3 ${styles["friend-profile"]}`}
          data-aos="zoom-in-left"
          data-aos-duration="1000"
        >
          <button
            onClick={() => setFriendProfile(false)}
            className={styles["back-btn"]}
          >
            <h3 style={{ color: "#005c4b" }}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </h3>
          </button>

          <div className={styles["profile-top"]}>
            <img src={friend.avatar ? friend.avatar : avatar} alt="" />
            <h4 className="text-white">{friend.username}</h4>
          </div>

          <div className={styles["profile-info"]}>
            <h5 className="mb-3">Info</h5>
            <hr className="text-white mb-4" />
            <small>phone number</small>
            <p>{friend.phone}</p>
            <hr className="text-white" />

            <hr className="my-3" />
            <small>username</small>
            <p>{friend.username ? `@${friend.username}` : "Not set"}</p>
            <hr className="text-white" />

            <hr className="my-3" />
            <small>Bio</small>
            <p>{friend.bio ? friend.bio : "I'm using Whatapp"}</p>
            <hr className="text-white" />
          </div>
        </main>
      )}
    </body>
  );
};

export default Main;
