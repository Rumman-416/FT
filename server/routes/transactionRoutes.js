const express = require("express");
const {
  addTransaction,
  getAllTransaction,
  getTransaction,
} = require("../controllers/transaction");

//router object
const router = express.Router();

//routers
//add transaction
router.post("/add-transaction", addTransaction);
//get transactions
router.post("/get-transactions", getAllTransaction);
router.get("/get-transaction", getTransaction);

module.exports = router;
