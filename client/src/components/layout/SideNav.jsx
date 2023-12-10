import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SideNav = () => {
  const [isExpanded, setExpanded] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);

  const toggleExpand = (e) => {
    e.preventDefault();
    setExpanded(!isExpanded);
  };
  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:/transactions/get-transaction`
        );
        setAllTransaction(res.data);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getAllTransactions();
  }, []);

  return (
    <div>
      <div
        className={` bg-green-400 fixed my-4 h-14 w-14 rounded-r-full z-[999] flex flex-col justify-center gap-1 items-center cursor-pointer ${
          isExpanded ? "bg-green-400 " : ""
        }  transition-all duration-[2000ms] ease-in-out`}
        onClick={toggleExpand}
      >
        <div
          className={`h-1 w-6 bg-white transform transition-transform${
            isExpanded ? " -rotate-[20deg]" : " rotate-[20deg] w-13"
          }`}
        ></div>
        <div
          className={`h-1 w-6 bg-white transform transition-transform${
            isExpanded ? " rotate-[20deg]" : " -rotate-[20deg] w-13"
          }`}
        ></div>
      </div>
      <div
        className={`fixed top-0 left-0  bg-green-400 flex rounded-r-full justify-center items-center z-[900] transition-all duration-500 ease-in-out  ${
          isExpanded
            ? " w-[11rem] h-[45rem] opacity-100 lg:w-[15rem]"
            : "bg-green-400 my-4 h-[45rem] w-0 opacity-0"
        }`}
      >
        <div className={` font-head ${isExpanded ? " text-lg" : "text-[0px]"}`}>
          <Link
            className="block py-2 text-[#23253a] hover:text-[#fff]"
            to={{
              pathname: "/",
            }}
          >
            Home
          </Link>
          <Link className="block py-2 text-[#23253a] hover:text-[#fff]">
            Transaction
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
