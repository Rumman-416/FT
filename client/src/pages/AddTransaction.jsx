// Home.jsx

import React, { useState, useEffect, Suspense } from "react";
import Layout from "../components/layout/Layout";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "antd/lib/modal";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Select from "antd/lib/select";

const Analytics = React.lazy(() => import("../components/Analytics"));

const AddTransaction = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const response = await axios.post(
        "https://temp-ft-crud.onrender.com/transactions/add-transaction",
        {
          ...values,
          userid: user._id,
        }
      );
      setLoading(false);
      console.log(response.data);
      getAllTransactions();
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
    }
  };

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

  useEffect(() => {
    getAllTransactions();
  }, []);

  return (
    <Layout>
      {loading && <Spinner />}
      <Suspense fallback={<p> Loading</p>}>
        <Analytics allTransaction={allTransaction} />
      </Suspense>
      <div>
        <button onClick={() => setShowModal(true)}>Add New</button>
      </div>
      <Modal
        title="Add Transaction"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Name" name="name">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Amount" name="amount">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="Entertainment">Entertainment</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
              <Select.Option value="bill">Bills</Select.Option>
              <Select.Option value="others">Others</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="flex justify-end items-center">
            <button type="submit" className="border-2 h-8 w-16">
              Save
            </button>
          </div>
        </Form>
      </Modal>
      <button onClick={() => navigate("/show-data")}>Transactions</button>
    </Layout>
  );
};

export default AddTransaction;
