const aiService = require("../services/ai.service");

// 🧠 Review Code Endpoint
module.exports.getReview = async (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).send("❌ Prompt is required");
  }

  try {
    const response = await aiService.generateReview(code);
    res.send(response);
  } catch (error) {
    console.error("❌ Error in getReview:", error.message);
    res.status(500).send("Something went wrong during code review.");
  }
};

// 📘 Explain DSA Topic Endpoint
module.exports.explainDSA = async (req, res) => {
  const topic = req.body.topic;

  if (!topic) {
    return res.status(400).send("❌ DSA topic is required");
  }

  try {
    const explanation = await aiService.explainDSA(topic);
    res.send(explanation);
  } catch (error) {
    console.error("❌ Error in explainDSA:", error.message);
    res.status(500).send("Something went wrong while explaining DSA.");
  }
};
