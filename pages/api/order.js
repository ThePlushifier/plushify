import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, address, city, country, wallet, notes, image } = req.body;
  if (!name || !email || !address) return res.status(400).json({ error: 'Missing required fields' });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  // Save order to DB
  const { data, error } = await supabase.from('orders').insert({
    name, email, address, city, country, wallet, notes,
    image: image || null,
    status: 'pending',
  }).select().single();

  if (error) return res.status(500).json({ error: error.message });

  // Notify via Telegram
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    const msg = `🧸 NEW PLUSH ORDER!\n\nName: ${name}\nEmail: ${email}\nCity: ${city}, ${country}\nWallet: ${wallet || 'none'}\nNotes: ${notes || 'none'}\n\nOrder ID: ${data.id}`;
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: msg }),
    }).catch(console.error);
  }

  res.status(200).json({ ok: true, id: data.id });
}
