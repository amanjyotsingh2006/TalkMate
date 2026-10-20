
const allowedActions = ["translate", "grammar", "suggest"];

export async function aiActions(req, res) {
    try {
        const { action, text, targetLanguage, conversationContext } = req.body;

        if (!allowedActions.includes(action)) {
            return res.status(400).json({
                message: "Invalid AI action.",
            });
        }

        if (
            typeof text !== "string" ||
            text.length > 5000 ||
            (action !== "suggest" && !text.trim())
        ) {
            return res.status(400).json({
                message: "Please provide valid text (maximum 5000 characters).",
            });
        }

        if (
            action === "translate" &&
            (!targetLanguage ||
                typeof targetLanguage !== "string" ||
                targetLanguage.length > 60)
        ) {
            return res.status(400).json({
                message: "Please select a target language.",
            });
        }

        let prompt;

        if (action === "translate") {
            prompt = `Translate the following message into ${targetLanguage}. Preserve its original meaning and tone. Return only the translated message.\n\nMessage:\n${text}`;
        } else if (action === "grammar") {
            prompt = `Correct the grammar, spelling and punctuation in this message. Keep its original meaning and tone. Return only the corrected message.\n\nMessage:\n${text}`;
        } else {
            if (
                typeof conversationContext !== "string" ||
                !conversationContext.trim()
            ) {
                return res.status(400).json({
                    message: "Provide the latest received message to generate replies.",
                });
            }

            prompt = `You are helping someone reply in a friendly chat. Generate exactly 3 distinct, natural reply suggestions to the latest received message. Return exactly 3 numbered lines, with no introduction. Keep each reply concise and appropriate to the context.\n\nLatest received message:\n${conversationContext.slice(0, 2000)}\n\nOptional draft from the user:\n${text.slice(0, 1000)}`;
        }

        const { GoogleGenAI } = await import("@google/genai");

        const ai = new GoogleGenAI({
            apiKey: process.env.AI_API_Key,
        });

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-flash-latest",
            contents: prompt,
        });

        const result = response.text?.trim();

        if (!result) {
            return res.status(502).json({
                message: "The AI returned an empty response. Try again.",
            });
        }

        return res.json({ result });

    } catch (error) {
        console.error("AI assist error:", error);

        const status = Number(error.status ?? error.code);

        if (status === 503) {
            return res.status(503).json({
                message:
                    "The AI service is temporarily busy. Please try again shortly.",
            });
        }

        return res.status(500).json({
            message: "AI assistance failed. Please try again.",
        });
    }

}
