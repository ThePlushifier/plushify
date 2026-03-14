import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id, week } = req.body;

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  // Mark as winner
  const { data: winner, error } = await supabase
    .from('submissions')
    .update({ winner: true, winner_week: week })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Announce on X
  let announced = false;
  try {
    const { TwitterApi } = require('twitter-api-v2');
    const client = new TwitterApi({
      appKey: process.env.X_API_KEY,
      appSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
    });
    const tweet = `👑 THIS WEEK'S WINNER!\n\n${winner.name || 'Anonymous'} has been chosen by the community.\n\nTheir plush is going into production. A 1/1 NFT is being minted to their wallet.\n\nCongrats. You've been Plushified. 🧸\n\nplushify.wtf/arena`;
    await client.v1.tweet(tweet);
    announced = true;
  } catch (e) {
    console.error('X post failed:', e.message);
  }

  // Notify via Telegram
  try {
    const msg = `👑 WINNER PICKED!\n\n${winner.name || 'Anonymous'}\nVotes: ${winner.votes}\nWallet: ${winner.wallet || 'none'}\nWeek: ${week}`;
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: msg }),
    });
  } catch (e) { console.error('Telegram failed:', e.message); }

  res.status(200).json({ ok: true, announced, winner });
}
