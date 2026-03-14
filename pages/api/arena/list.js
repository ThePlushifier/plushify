import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('round_date', today)
    .order('votes', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ submissions: data || [] });
}
