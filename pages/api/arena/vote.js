import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'No id' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { error } = await supabase.rpc('increment_votes', { row_id: id });
  if (error) {
    // fallback if RPC not set up
    const { data: current } = await supabase.from('submissions').select('votes').eq('id', id).single();
    await supabase.from('submissions').update({ votes: (current?.votes || 0) + 1 }).eq('id', id);
  }

  res.status(200).json({ ok: true });
}
