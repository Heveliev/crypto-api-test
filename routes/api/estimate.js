const express = require("express");
const {estimate} = require("../../controllers");

const router = express.Router();

router.get("/",estimate);

module.exports = router;