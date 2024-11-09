const express = require("express");
const profileRouter = require("./profile.router");

const api = express.Router();

api.use("/api/auth/", profileRouter);

module.exports = api;


