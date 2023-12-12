import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideNav from "./SideNav";

const Header = () => {
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState(" ");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    window.alert("User logged out");
    navigate("/login");
  };
  return (
    <div>
      <nav className=" bg-blue-300 flex gap-5 h-20">
        <SideNav />
        <ul>
          <Link to="/">home</Link>
        </ul>
        <h1>{loginUser && loginUser.name}</h1>
        <button className=" bg-gray-500" onClick={logoutHandler}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Header;
