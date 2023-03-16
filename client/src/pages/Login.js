import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserInfo } = useContext(UserContext);
  async function login(e) {
    e.preventDefault();
    console.log(process.env.REACT_APP_API_URL)
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);

        alert("Login sucessful");

        window.location.replace("/");
      });
    } else {
      alert("Username and password don't match");
    }
  }

  return (
    <form className="login" onSubmit={login}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <br/>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br/>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
