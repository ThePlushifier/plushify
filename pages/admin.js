import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Admin.module.css';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'plushify2025';

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(null);
  const [message, setMessage] = useState('');
  const [week, setWeek] = useState('');

  useEffect(() => {
    const getWeek = () => {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const weekNum = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
      return `${now.getFullYear()}-W${weekNum}`;
    };
    setWeek(getWeek());
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_auth')) setAuth(true);
  }, []);

  useEffect(() => { if (auth) fetchAll(); }, [auth]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } finally { setLoading(false); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuth(true);
      sessionStorage.setItem('admin_auth', '1');
    } else {
      setMessage('Wrong password');
    }
  };

  const pickWinner = async (id) => {
    setMessage('');
    const res = await fetch('/api/admin/pick-winner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, week }),
    });
    const data = await res.json();
    if (data.ok) {
      setMessage(`✅ Winner picked! ${data.announced ? 'Announced on X.' : ''}`);
      fetchAll();
    } else {
      setMessage(`❌ Error: ${data.error}`);
    }
  };

  const mintNFT = async (submission) => {
    setMinting(submission.id);
    setMessage('');
    try {
      const res = await fetch('/api/admin/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submission.id, wallet: submission.wallet, image: submission.image, name: submission.name }),
      });
      const data = await res.json();
      if (data.ok) setMessage(`✅ NFT minted! Tx: ${data.signature}`);
      else setMessage(`❌ Mint error: ${data.error}`);
    } finally { setMinting(null); }
  };

  const sorted = [...submissions].sort((a, b) => b.votes - a.votes);

  if (!auth) return (
    <div className={styles.login}>
      <Head><title>Admin — Plushify</title></Head>
      <h1>🧸 Admin</h1>
      <form onSubmit={handleLogin}>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Password" autoFocus />
        <button type="submit">Enter</button>
      </form>
      {message && <p className={styles.error}>{message}</p>}
    </div>
  );

  return (
    <div className={styles.page}>
      <Head><title>Admin — Plushify</title></Head>
      <header className={styles.header}>
        <h1>🧸 Plushify Admin</h1>
        <div className={styles.week}>Week: {week}</div>
        <button onClick={fetchAll} className={styles.refreshBtn}>↻ Refresh</button>
      </header>

      {message && <div className={styles.message}>{message}</div>}

      <main className={styles.main}>
        <div className={styles.stats}>
          <div className={styles.stat}><span>{submissions.length}</span><span>Submissions</span></div>
          <div className={styles.stat}><span>{submissions.reduce((a,b) => a + b.votes, 0)}</span><span>Total votes</span></div>
          <div className={styles.stat}><span>{submissions.filter(s => s.winner).length}</span><span>Winners picked</span></div>
        </div>

        {loading ? <p className={styles.loading}>Loading...</p> : (
          <div className={styles.grid}>
            {sorted.map((s, i) => (
              <div key={s.id} className={`${styles.card} ${s.winner ? styles.winnerCard : ''}`}>
                {s.winner && <div className={styles.winnerBadge}>👑 Winner</div>}
                <div className={styles.rank}>#{i+1}</div>
                <img src={s.image} alt={s.name} className={styles.img} />
                <div className={styles.info}>
                  <div className={styles.name}>{s.name || 'Anonymous'}</div>
                  <div className={styles.votes}>{s.votes} votes</div>
                  <div className={styles.date}>{new Date(s.created_at).toLocaleDateString()}</div>
                  {s.wallet && <div className={styles.wallet}>{s.wallet.substring(0,12)}...</div>}
                </div>
                <div className={styles.actions}>
                  {!s.winner && (
                    <button className={styles.pickBtn} onClick={() => pickWinner(s.id)}>
                      👑 Pick as winner
                    </button>
                  )}
                  {s.winner && !s.nft_minted && (
                    <button
                      className={styles.mintBtn}
                      onClick={() => mintNFT(s)}
                      disabled={minting === s.id}
                    >
                      {minting === s.id ? 'Minting...' : '🎨 Mint 1/1 NFT'}
                    </button>
                  )}
                  {s.nft_minted && <div className={styles.minted}>✅ NFT Minted</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
