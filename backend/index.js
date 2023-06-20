const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();

app.use(express.json());
app.use(cors());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/explain-code", async (req, res) => {
  console.log("req.body:", req.body);
  try {
    const { prompt } = req.body;

    console.log("The Prompt :", prompt);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: "user",
          content: `
      Give me a detailed audit report along with the below details.
      - Give an overview of the contract.
      - Explain each function in the program.
      - Few security vulnerabilities are Timestamp dependence, Default visibility, Block gas limit vulnerability, Simple logic error, Integer overflow and underflow, Front-running and Reentrancy attack. Check for all the possible vulnerabilities and only if found any suggest possible solutions for the same.
      ${prompt}
      `,
        },
      ],
      temperature: 1,
      max_tokens: 4097,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      // stop: ['"""'],
    });

    // console.log(response)
    // console.log(response.data)
    // console.log(response["choices"][0]["message"])
    // console.log(response.data.choices);
    console.log(response.data.choices[0]);
    console.log(response.data.choices[0].message.content);
    // console.log(response.data.choices[0]);

    return res.status(200).json({
      success: true,
      data: response.data.choices[0].message.content,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : `There was an issue on the server - ${error}`,
    });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
