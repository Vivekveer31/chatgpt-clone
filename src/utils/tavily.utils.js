import { tavily } from "@tavily/core";
import  dotenv from 'dotenv'
dotenv.config();

const client = tavily({ apiKey:process.env.TAVILY_API_KEY});

export default client