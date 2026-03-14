import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { image, name, wallet } = req.body;
  if (!image) return res.status(400).json({ error: 'No image' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const today = new Date().toISOString().split('T')[0];

  // Upload image to Supabase Storage using fetch directly
  let imageUrl = null;
  try {
    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const filename = `${Date.now()}.png`;

    const uploadRes = await fetch(
      `${process.env.SUPABASE_URL}/storage/v1/object/plushes/${filename}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Content-Type': 'image/png',
          'x-upsert': 'true',
        },
        body: buffer,
      }
    );

    if (uploadRes.ok) {
      imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/plushes/${filename}`;
    }
  } catch (e) {
    console.error('Storage upload failed:', e.message);
  }

  // If storage failed, store as base64 data URL directly
  if (!imageUrl) imageUrl = image;

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
