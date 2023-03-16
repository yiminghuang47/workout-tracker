import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [redirect,setRedirect] = useState(false);

  useEffect(() => {
    fetch("http://localhost:1337/api/profile", { credentials: "include" })
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((info) => {
              setUserInfo(info);
            })
            .catch((e) => console.error(e));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  async function logout(e) {
    e.preventDefault();
    await fetch("http://localhost:1337/api/logout", {
      credentials: "include",
      method: "POST",
    });
    
    setRedirect(true);
    await setUserInfo(null);

  }
  
  if (redirect) {
    window.location.replace('/');
  }
  return (
    <header>
      <nav className="nav-bar">
        <Link to="/" className="nav-link">Home</Link>

        {userInfo === null || Object.keys(userInfo).length === 0 ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Sign Up</Link>
          </>
        ) : (
          <>
            <div className="welcome-text">Welcome back {userInfo.username}!</div>
            <Link to="/workouts" className="nav-link">My Workouts</Link>
            <Link to="/visualize" className="nav-link">Visualize</Link>
            <div onClick={logout} className="logout-btn">Logout</div>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
