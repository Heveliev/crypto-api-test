const express = require("express");
const {getEstimate} = require("../../controllers");

const router = express.Router();

router.get("/",getEstimate);

module.exports = router;