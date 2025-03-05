require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { generateText } = require('ai');
const { openai } = require('@ai-sdk/openai');

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const imageBase64 = req.file.buffer.toString('base64');
    
    const prompt = `
      Analyze this outfit image:
      [Image: ${imageBase64.substring(0, 20)}...]
      
      Describe the outfit in fashion terms.
      Provide style improvement suggestions based on Die Work Wear style for men.
      Include specific terminology and potential items to purchase.
      Format your response as JSON with these fields:
      - description: detailed description of the current outfit
      - style: current style category
      - suggestions: array of 3 improvement suggestions
      - shopping: array of recommended items to purchase with price estimates
    `;

    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: prompt,
      system: "You are a men's fashion expert specializing in classic menswear in the style of Die Work Wear blog. Analyze outfits and provide detailed, constructive feedback."
    });

    const analysis = JSON.parse(text);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing fashion:', error);
    res.status(500).json({ error: 'Failed to analyze fashion' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));