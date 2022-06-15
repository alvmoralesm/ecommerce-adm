const express = require("express");
const router = express.Router();
const client = require("../controllers/client");

router.route("/").get(client.products);

module.exports = router;
