import OpenAI from 'openai';
import { toFile } from 'openai';
import formidable from 'formidable';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const form = formidable({ maxFileSize: 10 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });

    const file = files.image?.[0] || files.image;
    if (!file) return res.status(400).json({ error: 'No image provided' });

    try {
      const imageBuffer = fs.readFileSync(file.filepath);
      const imageFile = await toFile(imageBuffer, 'pfp.png', { type: 'image/png' });

      const response = await openai.images.edit({
        model: 'gpt-image-1',
        image: imageFile,
        prompt: 'Transform this into an adorable 3D plush stuffed animal toy version. Keep the exact same character, colors, and features but make it look like a soft, huggable plush toy with visible stitching, felt fabric texture, and rounded plush proportions. Studio lighting, white background, product photo quality.',
        n: 1,
        size: '1024x1024',
      });

      const imageData = response.data[0].b64_json;
      res.status(200).json({ image: `data:image/png;base64,${imageData}` });

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });
}
