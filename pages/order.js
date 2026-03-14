import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Order.module.css';

export default function Order() {
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', country: '', wallet: '', notes: '' });
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pull image from sessionStorage if coming from plushify page
  useState(() => {
    if (typeof window !== 'undefined') {
      const img = sessionStorage.getItem('plushify_order_image');
      if (img) setImage(img);
    }
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSubmitted(true);
      if (typeof window !== 'undefined') sessionStorage.removeItem('plushify_order_image');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className={styles.page}>
      <div className={styles.success}>
        <div className={styles.successIcon}>🧸</div>
        <h1>Order received!</h1>
        <p>The Plushifier has your order. You'll hear from us within 48 hours with a confirmation and timeline.</p>
        <p className={styles.successSub}>Keep an eye on <a href="https://x.com/ThePlushifier" target="_blank" rel="noopener noreferrer">@ThePlushifier</a> for updates.</p>
        <a href="/" className={styles.backBtn}>Back to Plushify</a>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <Head>
        <title>Order Your Plush — Plushify</title>
        <meta name="description" content="Order your custom 1/1 plush + NFT. Submit your photo and we'll make it real." />
      </Head>

      <header className={styles.header}>
        <a href="/" className={styles.logo}>🧸 Plushify</a>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Order your plush.</h1>
          <p>Fill in your details and we'll make your plush real. Every order includes a 1/1 NFT minted to your wallet.</p>
        </div>

        <div className={styles.layout}>
          {image && (
            <div className={styles.preview}>
              <div className={styles.previewLabel}>Your plush preview</div>
              <img src={image} alt="Your plush" className={styles.previewImg} />
              <div className={styles.previewBadge}>1/1 — never made again</div>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Contact</div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div className={styles.field}>
                  <label>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>Shipping</div>
              <div className={styles.field}>
                <label>Address *</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Street address" required />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>City *</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                </div>
                <div className={styles.field}>
                  <label>Country *</label>
                  <input name="country" value={form.country} onChange={handleChange} placeholder="Country" required />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>NFT</div>
              <div className={styles.field}>
                <label>Solana wallet address</label>
                <input name="wallet" value={form.wallet} onChange={handleChange} placeholder="Your Solana wallet address (for the NFT)" />
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.field}>
                <label>Notes (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any special requests, size preferences, etc." rows={3} />
              </div>
            </div>

            {error && <div className={styles.error}>⚠️ {error}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Submitting...' : '🧸 Place order'}
            </button>

            <p className={styles.disclaimer}>
              Pricing and payment will be confirmed via email. Currently accepting early orders — $PLUSH holders get priority fulfillment.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
