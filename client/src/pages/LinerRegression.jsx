import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";

const LinearRegression = ({ data, selectedCategory }) => {
  const [prediction, setPrediction] = useState(null);
  const [aggregatedExpenseData, setAggregatedExpenseData] = useState([]);

  useEffect(() => {
    const runLinearRegression = async () => {
      if (data.length === 0) {
        console.warn("No data available for prediction.");
        setPrediction(null);
        return;
      }

      // Prepare data for selected category, excluding income
      const filteredData = data.filter(
        (item) => item.category === selectedCategory && item.type === "expense"
      );

      if (filteredData.length === 0) {
        console.warn(
          `No expense data available for the selected category ${selectedCategory}.`
        );
        setPrediction(null); // Reset prediction if no expense data
        return;
      }

      // Calculate the average amount for prediction, excluding income
      const totalAmount = filteredData.reduce(
        (acc, item) => acc + item.amount,
        0
      );
      const averageAmount = totalAmount / filteredData.length;

      setPrediction(averageAmount);
    };

    runLinearRegression();
  }, [data, selectedCategory]);

  // Prepare data for Recharts
  useEffect(() => {
    const expenseData = data
      .filter(
        (item) => item.category === selectedCategory && item.type === "expense"
      )
      .reduce((acc, item) => {
        const existingItem = acc.find(
          (entry) =>
            new Date(entry.date).getMonth() === new Date(item.date).getMonth()
        );
        if (existingItem) {
          existingItem.totalExpense += item.amount;
        } else {
          acc.push({
            date: item.date,
            totalExpense: item.amount,
          });
        }
        return acc;
      }, []);

    setAggregatedExpenseData(expenseData);
  }, [data, selectedCategory]);

  const regressionLineData =
    prediction !== null && aggregatedExpenseData.length > 0
      ? [
          {
            regressionLine: prediction,
          },
        ]
      : [];

  return (
    <div className="chart-container">
      <h3>{`Expense Linear Regression Prediction for ${selectedCategory}`}</h3>
      {prediction !== null && aggregatedExpenseData.length > 0 ? (
        <LineChart
          className="line-chart"
          width={450}
          height={300}
          data={aggregatedExpenseData.concat(regressionLineData)}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="date" />
          <YAxis>
            <Label value="Total Expense" angle={-90} position="insideLeft" />
          </YAxis>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip
            formatter={(value, name, props) => [value, "Total Expense"]}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString("default", {
                month: "long",
                year: "numeric",
              })
            }
          />
          <Legend />
          <Line type="monotone" dataKey="totalExpense" stroke="#FF7E5F" />
          <Line
            type="monotone"
            dataKey="regressionLine"
            stroke="#0000FF"
            strokeDasharray="5 5"
          />
        </LineChart>
      ) : (
        <p>{`No expense data available for the selected category ${selectedCategory}.`}</p>
      )}
    </div>
  );
};

export default LinearRegression;
