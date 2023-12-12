import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";

const LinearRegression = ({ data, selectedCategory }) => {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const runLinearRegression = async () => {
      if (data.length === 0) {
        console.warn("No data available for prediction.");
        return;
      }

      const filteredData = data.filter(
        (item) => item.category === selectedCategory
      );

      if (filteredData.length === 0) {
        console.warn("No expense data available for the selected category.");
        return;
      }

      const totalAmount = filteredData.reduce(
        (acc, item) => acc + item.amount,
        0
      );

      setPrediction(totalAmount / filteredData.length);
    };

    runLinearRegression();
  }, [data, selectedCategory]);

  const chartData = data
    .map((item) => ({
      type: item.type,
      amount: item.amount,
      date: new Date(item.date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const getOption = () => {
    const colors = {
      expense: "#FF7E5F",
      regressionLine: "#0000FF",
    };

    const uniqueDates = [
      ...new Set(chartData.map((item) => item.date)),
    ].reverse();

    const aggregatedExpenseData = uniqueDates.map((date) => ({
      date,
      totalExpense: chartData
        .filter((item) => item.type === "expense" && item.date === date)
        .reduce((acc, item) => acc + item.amount, 0),
    }));

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
          type: "line",
          data: aggregatedExpenseData.map((item) => ({
            value: item.totalExpense,
            itemStyle: { color: colors.expense },
          })),
          label: {
            show: true,
            position: "top",
            formatter: "{c}",
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
