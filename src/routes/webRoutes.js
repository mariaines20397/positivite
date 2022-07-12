const express = require("express");
const router = express.Router();
const path = require("path");
const webControllers = require("../controllers/webControllers");

router.get("/", webControllers.index);
router.get("/contactUs", webControllers.contacUs);

module.exports = router;
