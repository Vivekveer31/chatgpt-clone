import { OpenAI } from "openai"
import dotenv from  "dotenv"
dotenv.config();

const client=new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
      baseURL:process.env.GROQ_BASE_URI,
 });

 export default client;