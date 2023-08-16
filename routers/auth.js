const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

// POST Sign Up
router.post("/signup", authController.postSignUp);

// GET Log In - Send All users Data to client
router.post("/users", authController.postLogin);

module.exports = router;
