import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`https://temp-ft-crud.onrender.com/users/register`, {
        name,
        email,
        password,
      });
      window.alert(`Successfully registered`);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      window.alert(`Failed to register`);
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
        <h1>Signup</h1>
        <form action="" className="flex flex-col gap-3">
          <span>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              className="border-2"
              onChange={(e) => setName(e.target.value)}
            />
          </span>
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
          <Link to="/login" className=" text-blue-400">
            Already have an account ? Click here to login
          </Link>
          <input
            type="submit"
            value="Register"
            className="border-2 bg-slate-500 "
            onClick={submitHandler}
          />
        </form>
      </div>
    </>
  );
};

export default Register;
