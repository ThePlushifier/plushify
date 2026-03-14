import { createClient } from '@supabase/supabase-js';
import FormData from 'form-data';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { image, name, wallet } = req.body;
  if (!image) return res.status(400).json({ error: 'No image' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const today = new Date().toISOString().split('T')[0];

  // Upload to catbox.moe (free, reliable)
  let imageUrl = image;
  try {
    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('time', '72h');
    form.append('fileToUpload', buffer, { filename: 'plush.png', contentType: 'image/png' });
    const uploadRes = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });
    const url = await uploadRes.text();
    if (url.startsWith('https://')) imageUrl = url.trim();
  } catch (e) {
    console.error('Image upload failed:', e.message);
    // Fall back to storing data URL (truncated for DB)
  }

  const { data, error } = await supabase.from('submissions').insert({
    image: imageUrl,
    name: name || 'Anonymous',
    wallet: wallet || null,
    votes: 0,
    round_date: today,
  }).select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ submission: data });
}
