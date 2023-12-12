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

  useEffect(() => {
    const runLinearRegression = async () => {
      if (data.length === 0) {
        console.warn("No data available for prediction.");
        return;
      }

      // Prepare data for selected category
      const filteredData = data.filter(
        (item) => item.category === selectedCategory
      );

      if (filteredData.length === 0) {
        console.warn("No expense data available for the selected category.");
        return;
      }

      // Calculate the average amount for prediction
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
  const chartData = data.map((item) => ({
    type: item.type,
    amount: item.amount,
    date: new Date(item.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    }),
  }));

  const aggregatedExpenseData = chartData.reduce((acc, item) => {
    if (item.type === "expense") {
      const existingItem = acc.find((entry) => entry.date === item.date);
      if (existingItem) {
        existingItem.totalExpense += item.amount;
      } else {
        acc.push({ date: item.date, totalExpense: item.amount });
      }
    }
    return acc;
  }, []);

  const regressionLineData = aggregatedExpenseData.map((item) => ({
    date: item.date,
    regressionLine: prediction !== null ? prediction : 0,
  }));

  // const combinedData = aggregatedExpenseData.concat(regressionLineData);
  return (
    <div className="chart-container">
      <h3>{`Expense Linear Regression Prediction for ${selectedCategory}`}</h3>
      {prediction !== null ? (
        <LineChart
          className="line-chart"
          width={450}
          height={300}
          data={aggregatedExpenseData.concat(regressionLineData)}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="date"
            tick={() => null} // Remove individual ticks
          >
            <Label value="Date" offset={0} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Total Expense" angle={-90} position="insideLeft" />
          </YAxis>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
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
        <p>Loading prediction...</p>
      )}
    </div>
  );
};

export default LinearRegression;
