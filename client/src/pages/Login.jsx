import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:8080/users/login", {
        email,
        password,
      });
      setLoading(false);
      window.alert(`login successful`);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      navigate("/");
    } catch (error) {
      setLoading(false);
      window.alert(`Failed to login`);
    }
  };
  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <>
      <div className=" flex flex-col justify-center items-center">
        {loading && <Spinner />}
        <h1>Login</h1>
        <form action="" className="flex flex-col gap-3">
          <span>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              className="border-2"
              onChange={(e) => setEmail(e.target.value)}
            />
          </span>
          <span>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              className="border-2"
              onChange={(e) => setPassword(e.target.value)}
            />
          </span>
          <Link to="/register" className=" text-blue-400">
            Don't have an account ? Click here to signup
          </Link>
          <input
            type="submit"
            value="Registerrrrrrrr"
            className="border-5 bg-yellow-500 "
            onClick={submitHandler}
          />
        </form>
      </div>
    </>
  );
};

export default Login;
