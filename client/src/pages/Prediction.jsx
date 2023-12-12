import React, { Suspense, useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";

const LinearRegression = React.lazy(() => import("./LinerRegression"));

const Prediction = () => {
  const [allTransaction, setAllTransaction] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await axios.post(
          "http://localhost:8080/transactions/get-only-transactions",
          { userid: user._id }
        );

        const categories = [...new Set(res.data.map((t) => t.category))];
        setAllTransaction(res.data);
        setUniqueCategories(categories);

        if (categories.length > 0) {
          setSelectedCategory(categories[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="mt-10">
        <h2>Linear Regression Predictions</h2>
        {uniqueCategories.length > 0 && (
          <>
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
          </>
        )}
        <Suspense fallback={<div>Loading...</div>}>
          <LinearRegression
            data={allTransaction}
            selectedCategory={selectedCategory}
          />
        </Suspense>
      </div>
    </Layout>
  );
};

export default Prediction;
