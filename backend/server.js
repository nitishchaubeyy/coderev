require('dotenv').config()
console.log("Check API Key:", process.env.GOOGLE_GEMINI_KEY ? "Loaded ✅" : "Not Loaded ❌");
const app = require('./src/app')



app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})