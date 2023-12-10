import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const Analytics = ({ allTransaction }) => {
  const totalTransactions = allTransaction.length;

  const totalIncomeTransactions = allTransaction.filter(
    (transaction) => transaction.type === "income"
  );
  const totalExpenseTransactions = allTransaction.filter(
    (transaction) => transaction.type === "expense"
  );

  const totalIncomePercent =
    totalTransactions > 0
      ? (totalIncomeTransactions.length / totalTransactions) * 100
      : 0;

  const totalExpensePercent =
    totalTransactions > 0
      ? (totalExpenseTransactions.length / totalTransactions) * 100
      : 0;

  const totalTurnover = allTransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const totalIncomeTurnover = allTransaction
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenseTurnover = allTransaction
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncomeTurnoverPercent =
    totalTurnover > 0 ? (totalIncomeTurnover / totalTurnover) * 100 : 0;

  const totalExpenseTurnoverPercent =
    totalTurnover > 0 ? (totalExpenseTurnover / totalTurnover) * 100 : 0;

  const data = [
    { name: "Income", value: totalIncomePercent },
    { name: "Expense", value: totalExpensePercent },
  ];

  const dataTurnover = [
    { name: "Income", value: totalIncomeTurnoverPercent },
    { name: "Expense", value: totalExpenseTurnoverPercent },
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div>
        <div>Total Transactions: {totalTransactions}</div>
        <div>Income: {totalIncomeTransactions.length}</div>
        <div>Expense: {totalExpenseTransactions.length}</div>
        <div className="flex items-center">
          <div className="">
            <div className="flex items-center">
              <div className=" h-5 w-5 bg-[#4ADE80]"></div>
              <h1>: Income</h1>
            </div>
            <div className="flex items-center">
              <div className=" h-5 w-5 bg-[#ff4b56]"></div>
              <h1>: Expense</h1>
            </div>
          </div>
          {totalIncomePercent !== 0 || totalExpensePercent !== 0 ? (
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#82ca9d"
                  paddingAngle={0}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "Income" ? " #4ADE80" : "#ff4b56"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-[200px] h-[200px]">No data available</div>
          )}
        </div>
      </div>
      <div>
        <div>Total Turnover: {totalTurnover}</div>
        <div>Income: {totalIncomeTurnover}</div>
        <div>Expense: {totalExpenseTurnover}</div>
        <div className="flex items-center">
          <div className="">
            <div className="flex items-center">
              <div className=" h-5 w-5 bg-[#4ADE80]"></div>
              <h1>: Income</h1>
            </div>
            <div className="flex items-center">
              <div className=" h-5 w-5 bg-[#ff4b56]"></div>
              <h1>: Expense</h1>
            </div>
          </div>
          {totalIncomeTurnoverPercent !== 0 ||
          totalExpenseTurnoverPercent !== 0 ? (
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={dataTurnover}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#82ca9d"
                  paddingAngle={0}
                  dataKey="value"
                >
                  {dataTurnover.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "Income" ? " #4ADE80" : "#ff4b56"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-[200px] h-[200px]">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
