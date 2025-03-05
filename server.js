require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/analyze', async (req, res) => {
  try {
    const { image } = req.body;

    const deepseekResponse = await axios.post('https://api.deepseek.com/v1/vision/chat', {
      model: "deepseek-vision",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this outfit image. Describe the outfit in fashion terms. Provide style improvement suggestions based on Die Work Wear style for men. Include specific terminology and potential items to purchase. Format your response as JSON with these fields: description (detailed description of the current outfit), style (current style category), suggestions (array of 3 improvement suggestions), shopping (array of recommended items to purchase with price estimates)."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`
              }
            }
          ]
        }
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const aiResponse = deepseekResponse.data.choices[0].message.content;
    const analysis = JSON.parse(aiResponse);

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing fashion:', error);
    res.status(500).json({ error: 'Failed to analyze fashion' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));