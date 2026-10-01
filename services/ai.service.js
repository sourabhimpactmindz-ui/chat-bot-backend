// import OpenAI from "openai";
// import "dotenv/config";

// const ai = new OpenAI({
//   baseURL: process.env.MODEL_URL,
//   apiKey: process.env.apiKey,
// });

// export const generateAiResponse = async (messages) => {
//   try {
//     const response = await ai.chat.completions.create({
//       model: "inclusionai/ling-3.0-flash-sante:free",
//       messages,
//     });

//     return response.choices[0].message.content;
//   } catch (error) {
//     console.error("AI Error:", error);
//     throw error;
//   }
// };\\

import OpenAI from "openai";
import "dotenv/config";

const ai = new OpenAI({
  baseURL: process.env.MODEL_URL,
  apiKey: process.env.apiKey,
});

export const generateAiResponse = async (messages) => {
  try {
    const response = await ai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};