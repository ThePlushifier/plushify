import Head from 'next/head';
import { useState, useRef } from 'react';
import styles from '../styles/Plushify.module.css';

const PUMP_FUN_URL = 'https://pump.fun/coin/4B2obgHGfUYg9nEvENpnBv9WJut8pXtKDPHx4VsRpump';

export default function PlushifyPage() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [name, setName] = useState('');
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const blob = await fetch(preview).then((r) => r.blob());
      const form = new FormData();
      form.append('image', blob, 'pfp.png');

      const res = await fetch('/api/plushify', { method: 'POST', body: form });
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      setResult(data.image);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>Plushify Your PFP — Plushify</title>
        <meta
          name="description"
          content="Upload any PFP, meme, or avatar and watch Plushify turn it into a plush concept. Physical plush + matching 1/1 NFT available to early supporters."
        />
      </Head>

      <header className={styles.header}>
        <a href="/" className={styles.logo}><span className={styles.logoMark}>🧸</span><span className={styles.logoText}>Plushify</span></a>
        <a href={PUMP_FUN_URL} className={styles.pill} target="_blank" rel="noopener noreferrer">Buy $PLUSH</a>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Plushify your PFP.</h1>
          <p>Upload any photo — avatar, meme, portrait, mascot. The machine turns it into a plush concept in seconds.</p>
        </div>

        <div className={styles.studio}>
          <div className={styles.panel}>
            <div className={styles.panelLabel}>Your image</div>
            <div
              className={`${styles.dropzone} ${dragging ? styles.dragging : ''} ${preview ? styles.hasImage : ''}`}
              onClick={() => fileRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
            >
              {preview ? (
                <img src={preview} alt="Your upload" className={styles.uploadedImage} />
              ) : (
                <div className={styles.dropPrompt}>
                  <span className={styles.dropIcon}>📎</span>
                  <span>Drop your image here</span>
                  <span className={styles.dropSub}>or click to browse</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {preview && !loading && (
              <button className={styles.plushifyBtn} onClick={handleSubmit}>
                🧸 Run the Plushifier
              </button>
            )}
          </div>

          <div className={styles.arrow}>→</div>

          <div className={styles.panel}>
            <div className={styles.panelLabel}>Your plush concept</div>
            <div className={`${styles.dropzone} ${styles.resultZone}`}>
              {loading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  <span>The machine is working...</span>
                </div>
              ) : result ? (
                <img src={result} alt="Your plush" className={styles.uploadedImage} />
              ) : (
                <div className={styles.dropPrompt}>
                  <span className={styles.dropIcon}>✨</span>
                  <span>Your plush appears here</span>
                </div>
              )}
            </div>
            {result && !submitted && (
              <div className={styles.submitArena}>
                <input
                  className={styles.nameInput}
                  placeholder="Your name / handle (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button
                  className={styles.orderBtn}
                  disabled={submitting}
                  onClick={async () => {
                    setSubmitting(true);
                    setError(null);
                    try {
                      const res = await fetch('/api/arena/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: result, name: name || 'Anonymous' }),
                      });
                      const data = await res.json();
                      if (!res.ok || data.error) throw new Error(data.error || `Server error ${res.status}`);
                      setSubmitted(true);
                    } catch (e) {
                      setError(`Submit failed: ${e.message}`);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {submitting ? 'Submitting...' : '🏟️ Submit to the Arena →'}
                </button>
              </div>
            )}
            {submitted && (
              <a href="/arena" className={styles.orderBtn}>
                ✅ Submitted! View the Arena →
              </a>
            )}
          </div>
        </div>

        {error && <div className={styles.error}>⚠️ {error}</div>}

        <p className={styles.disclaimer}>
          Preview is AI-generated. Physical plush + matching 1/1 NFT are part of the Plushify roadmap. Early supporters and $PLUSH holders get first access.
        </p>
      </main>
    </div>
  );
}
