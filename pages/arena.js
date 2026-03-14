import Head from 'next/head';
import { useState, useEffect } from 'react';
import styles from '../styles/Arena.module.css';

export default function Arena() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [voted, setVoted] = useState({});

  useEffect(() => {
    fetchSubmissions();
    const interval = setInterval(updateTimer, 1000);
    const voted = JSON.parse(localStorage.getItem('plushify_voted') || '{}');
    setVoted(voted);
    return () => clearInterval(interval);
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/arena/list');
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateTimer = () => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    setTimeLeft(`${h}h ${m}m ${s}s`);
  };

  const handleVote = async (id) => {
    if (voted[id]) return;
    try {
      const res = await fetch('/api/arena/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const newVoted = { ...voted, [id]: true };
        setVoted(newVoted);
        localStorage.setItem('plushify_voted', JSON.stringify(newVoted));
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, votes: s.votes + 1 } : s).sort((a,b) => b.votes - a.votes));
      }
    } catch (e) { console.error(e); }
  };

  const sorted = [...submissions].sort((a, b) => b.votes - a.votes);
  const winner = sorted[0];

  return (
    <div className={styles.page}>
      <Head>
        <title>The Plush Arena — Plushify</title>
        <meta name="description" content="Vote for the best plush. Winner gets made into a real 1/1 physical plush + NFT." />
      </Head>

      <header className={styles.header}>
        <a href="/" className={styles.logo}><span className={styles.logoMark}>🧸</span><span className={styles.logoText}>Plushify</span></a>
        <div className={styles.headerRight}>
          <a href="/plushify" className={styles.pill}>+ Submit yours</a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Daily competition</p>
          <h1>The Plush Arena</h1>
          <p>Vote for your favorite. The winner gets made into a real 1/1 plush + NFT.</p>
          <div className={styles.timer}>
            <span className={styles.timerLabel}>Round ends in</span>
            <span className={styles.timerCount}>{timeLeft}</span>
          </div>
        </div>

        {winner && (
          <div className={styles.leaderCard}>
            <div className={styles.leaderBadge}>👑 Leading</div>
            <img src={winner.image} alt="Current leader" className={styles.leaderImg} />
            <div className={styles.leaderInfo}>
              <span className={styles.leaderName}>{winner.name || 'Anonymous'}</span>
              <span className={styles.leaderVotes}>{winner.votes} votes</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, i) => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : submissions.length === 0 ? (
          <div className={styles.empty}>
            <p>No submissions yet. Be the first. 🧸</p>
            <a href="/plushify" className={styles.emptyBtn}>Generate & submit yours</a>
          </div>
        ) : (
          <div className={styles.grid}>
            {sorted.map((s, i) => (
              <div key={s.id} className={`${styles.card} ${i === 0 ? styles.topCard : ''}`}>
                {i === 0 && <div className={styles.rank}>👑</div>}
                {i === 1 && <div className={styles.rank}>🥈</div>}
                {i === 2 && <div className={styles.rank}>🥉</div>}
                {i > 2 && <div className={styles.rank}>#{i + 1}</div>}
                <img src={s.image} alt={s.name || 'Plush submission'} className={styles.cardImg} />
                <div className={styles.cardFooter}>
                  <span className={styles.cardName}>{s.name || 'Anonymous'}</span>
                  <button
                    className={`${styles.voteBtn} ${voted[s.id] ? styles.voted : ''}`}
                    onClick={() => handleVote(s.id)}
                    disabled={voted[s.id]}
                  >
                    {voted[s.id] ? `✓ ${s.votes}` : `🗳️ ${s.votes}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
