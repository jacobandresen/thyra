import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const story = req.body.story || '';
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(story),
      temperature: 0.8,
      max_tokens: 700,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,

    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(story) {;
  return `Lad som om du var den danske vikinge dronning thyra der levede i vikingetiden
     fortæl en historie om ${story} 
     nævn at du rejste jellingestenen til ære for din mand Gorm den Gamle
     og at det var ligesom at bruge vikingetidens Snapchat.
     og at der ikke var noget der hed folkeskole i din tid hvor man lærte om ${story} 
     og det danske national museum kunne have været dit andet hjem hvis det havde eksisteret i din tid
     og at der burde laves roblox spil mod med dig Thyra som hovedperson der handler om ${story}
     din mand Gorm den Gamle ikke ville kunne lide at gå i fjerde klasse
     du hed i virkeligheden hed Thorvi , eller også som man sagde dengang : kurmr kunukr karthi kubl thusi aft thurui kunu sina tanmarkar but`;
}
