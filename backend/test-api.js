require('dotenv').config();

async function checkModels() {
    const apiKey = process.env.GOOGLE_GEMINI_KEY;
    if (!apiKey) {
        console.log("❌ Error: .env file mein GOOGLE_GEMINI_KEY nahi mili!");
        return;
    }

    console.log("Checking models for key:", apiKey.substring(0, 8) + "...");

    try {
        // Direct fetch request Google API ko
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.log("❌ API Error:", data.error.message);
        } else if (data.models) {
            console.log("✅ Aapki key in models ko access kar sakti hai:");
            data.models.forEach(m => {
                console.log(`- ${m.name.replace('models/', '')}`);
            });
        } else {
            console.log("❓ Kuch ajeeb response aaya:", data);
        }
    } catch (err) {
        console.log("❌ Connection Error:", err.message);
    }
}

checkModels();