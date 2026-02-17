
import client from "./utils/openai.utils.js";




const init = async () => {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",   
    messages: [
        {
        role:"system",
        content:"U are senior developer"

       },
     
      { role: "user", content: "  who are u, what is your name?" }
    ],
  });

  console.log(response.choices[0].message.content);
};
  init()