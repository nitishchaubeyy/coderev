const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");

router.post("/get-review", aiController.getReview);
router.post("/explain-dsa", aiController.explainDSA); // Make sure this exists!

module.exports = router;
