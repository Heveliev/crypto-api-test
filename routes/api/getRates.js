const express = require("express");
const {getRates} = require("../../controllers");

const router = express.Router();

router.get("/",getRates)

module.exports = router;