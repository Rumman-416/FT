import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import LinearRegression from "./LinerRegression";

const Prediction = () => {
  const [allTransaction, setAllTransaction] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const getAllTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.post(
        "http://localhost:8080/transactions/get-only-transactions",
        { userid: user._id }
      );
      setAllTransaction(res.data);

      // Extract unique categories from transactions
      const categories = Array.from(
        new Set(res.data.map((transaction) => transaction.category))
      );
      setUniqueCategories(categories);

      // If there are unique categories, set the default category to the first one
      if (categories.length > 0) {
        setSelectedCategory(categories[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, []);

  return (
    <Layout>
      <div className="mt-10">
        <h2>Linear Regression Predictions</h2>
        {uniqueCategories.length > 0 && (
          <div>
            <label>Select Category: </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
        <LinearRegression
          data={allTransaction}
          selectedCategory={selectedCategory}
        />
      </div>
    </Layout>
  );
};

export default Prediction;
