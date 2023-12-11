import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Select from "antd/lib/select";
import DatePicker from "antd/lib/date-picker";
import axios from "axios";

const { RangePicker } = DatePicker;

const ShowData = () => {
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");

  const categoryIcons = {
    food: "ss",
    entertainment: "ss",
  };

  const getAllTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.post(
        `http://localhost:8080/transactions/get-transactions`,
        { userid: user._id, frequency, selectedDate, type }
      );
      setAllTransaction(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, [frequency, selectedDate, type]);

  const formatDateString = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const getCategoryIcon = (category) => {
    return categoryIcons[category];
  };

  return (
    <>
      <Layout>
        <div>
          <h6>Select frequency</h6>
          <Select
            value={frequency}
            className=" w-36"
            onChange={(values) => setFrequency(values)}
          >
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
            />
          )}
        </div>
        <div>
          <h6>Select type</h6>
          <Select
            value={type}
            className=" w-36"
            onChange={(values) => setType(values)}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </div>
        <div className="grid grid-cols-1">
          {allTransaction.map((transaction, index) => (
            <div className="m-5 bg-green-300 p-5 w-5/6" key={index}>
              <h1>Name: {transaction.name}</h1>
              <h1>Amount: {transaction.amount}</h1>
              <h1>Type: {transaction.type}</h1>
              <h1>Category: {transaction.category}</h1>
              <h1>Date: {formatDateString(transaction.date)}</h1>
              <h1 className=" w-20">Description: {transaction.description}</h1>
              <div className="flex items-center">
                <span>Icon: </span>
                {getCategoryIcon(transaction.category)}
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </>
  );
};

export default ShowData;
