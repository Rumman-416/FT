import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import ReactEcharts from "echarts-for-react";

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

      const xs = tf.tensor2d(
        filteredData.map(() => 1),
        [filteredData.length, 1]
      );
      const ys = tf.tensor2d(
        filteredData.map((item) => item.amount),
        [filteredData.length, 1]
      );

      // Create a simple linear regression model
      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
      model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

      // Train the model
      await model.fit(xs, ys, { epochs: 100 });

      // Make a prediction for the next month
      const newInput = tf.tensor2d([[1]]);
      const predictionTensor = model.predict(newInput);
      const [predictedAmount] = Array.from(predictionTensor.dataSync());
      setPrediction(predictedAmount);
    };

    runLinearRegression();
  }, [data, selectedCategory]);

  // Prepare data for Echarts
  const chartData = data
    .map((item) => ({
      type: item.type,
      amount: item.amount,
      date: item.date, // Use the original date value from the database
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
    .map((item) => ({
      type: item.type,
      amount: item.amount,
      date: new Date(item.date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      }), // Format the date for readability
    }));

  const getOption = () => {
    const colors = {
      expense: "#FF7E5F",
      regressionLine: "#0000FF",
    };

    const uniqueDates = Array.from(new Set(chartData.map((item) => item.date)));
    const reversedDates = uniqueDates.reverse();

    const aggregatedExpenseData = reversedDates.map((date) => {
      const totalExpense = chartData
        .filter((item) => item.type === "expense" && item.date === date)
        .reduce((acc, item) => acc + item.amount, 0);

      return {
        date,
        totalExpense,
      };
    });

    const regressionLineData = Array(aggregatedExpenseData.length).fill(
      prediction !== null ? prediction : 0
    );

    return {
      color: [colors.expense, colors.regressionLine],
      legend: {
        data: ["Expense", "Regression Line"],
      },
      xAxis: {
        type: "category",
        data: aggregatedExpenseData.map((item) => item.date),
        axisLabel: {
          rotate: 45,
          textStyle: {
            color: "#333",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          textStyle: {
            color: "#333",
          },
        },
      },
      series: [
        {
          name: "Expense",
          type: "line", // Changed to line chart for total expenses
          data: aggregatedExpenseData.map((item) => ({
            value: item.totalExpense,
            itemStyle: { color: colors.expense },
          })),
          label: {
            show: true,
            position: "top",
            formatter: "{c}", // Display the total expense value on the line
          },
        },
        {
          name: "Regression Line",
          type: "line",
          data: regressionLineData,
          lineStyle: {
            color: colors.regressionLine,
            type: "dashed",
          },
        },
      ],
    };
  };

  return (
    <div>
      <h3>{`Expense Linear Regression Prediction for ${selectedCategory}`}</h3>
      {prediction !== null ? (
        <ReactEcharts option={getOption()} style={{ height: "400px" }} />
      ) : (
        <p>Loading prediction...</p>
      )}
    </div>
  );
};

export default LinearRegression;
