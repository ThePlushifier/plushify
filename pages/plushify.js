import Head from 'next/head';
import { useState, useRef } from 'react';
import styles from '../styles/Plushify.module.css';

export default function PlushifyPage() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
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
      const blob = await fetch(preview).then(r => r.blob());
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
        <meta name="description" content="Upload your PFP and see it transformed into a plush toy. Order your 1/1 plush + NFT." />
      </Head>

      <header className={styles.header}>
        <a href="/" className={styles.logo}>🧸 Plushify</a>
        <a href="https://pump.fun" className={styles.pill} target="_blank" rel="noopener noreferrer">Buy $PLUSH</a>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Plushify your PFP.</h1>
          <p>Upload any photo — avatar, meme, portrait. The machine turns it into a plush.</p>
        </div>

        <div className={styles.studio}>
          {/* Upload */}
          <div className={styles.panel}>
            <div className={styles.panelLabel}>Your photo</div>
            <div
              className={`${styles.dropzone} ${dragging ? styles.dragging : ''} ${preview ? styles.hasImage : ''}`}
              onClick={() => fileRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
            >
              {preview ? (
                <img src={preview} alt="Your PFP" className={styles.uploadedImage} />
              ) : (
                <div className={styles.dropPrompt}>
                  <span className={styles.dropIcon}>📎</span>
                  <span>Drop your PFP here</span>
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
                🧸 Plushify it
              </button>
            )}
          </div>

          {/* Arrow */}
          <div className={styles.arrow}>→</div>

          {/* Result */}
          <div className={styles.panel}>
            <div className={styles.panelLabel}>Your plush</div>
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
            {result && (
              <button
                className={styles.orderBtn}
                onClick={() => {
                  sessionStorage.setItem('plushify_order_image', result);
                  window.location.href = '/order';
                }}
              >
                Order your physical plush + NFT →
              </button>
            )}
          </div>
        </div>

        {error && <div className={styles.error}>⚠️ {error}</div>}

        <p className={styles.disclaimer}>
          Preview is AI-generated. Physical plush + 1/1 NFT available to $PLUSH holders first.
        </p>
      </main>
    </div>
  );
}
