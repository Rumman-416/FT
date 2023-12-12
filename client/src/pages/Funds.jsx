import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";

const Funds = () => {
  const [allTransaction, setAllTransaction] = useState([]);
  const getAllTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.post(
        `http://localhost:8080/transactions/get-only-transactions`,
        { userid: user._id }
      );
      setAllTransaction(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const funds = [
    {
      name: "medical insurance",
      type: "low",
    },
  ];

  useEffect(() => {
    getAllTransactions();
  }, []);
  return (
    <Layout>
      {allTransaction.map((transaction) => (
        <div>{transaction.amount}</div>
      ))}
    </Layout>
  );
};

export default Funds;
