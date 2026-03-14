import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Plushify — Turn Memes Into Plush</title>
        <meta name="description" content="The machine that turns your PFP into a plush. Submit any photo → exact replica + 1/1 NFT. Mission: flip Toys R Us. $PLUSH on Pump.fun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>$PLUSH on Pump.fun</p>
            <h1 className={styles.headline}>
              Turn memes<br/>into plush.
            </h1>
            <p className={styles.subheadline}>
              The internet's toy factory is open.<br/>
              Submit any photo — PFP, meme, portrait — and get an exact plush replica made to order. Every plush comes with a 1/1 NFT.
            </p>
            <div className={styles.ctaRow}>
              <a href="/plushify" className={styles.ctaPrimary}>
                🧸 Plushify your PFP
              </a>
              <a href="https://pump.fun" className={styles.ctaSecondary} target="_blank" rel="noopener noreferrer">
                Buy $PLUSH
              </a>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img src="/mascot.png" alt="The Plushifier" />
          </div>
        </section>

        {/* MISSION */}
        <section className={styles.mission}>
          <div className={styles.missionInner}>
            <p className={styles.missionEyebrow}>The Mission</p>
            <h2>Flip Toys R Us.</h2>
            <p>
              Toys R Us was worth $11 billion at its peak.<br/>
              The internet killed it.<br/>
              Now the internet is going to build something bigger.
            </p>
            <div className={styles.statRow}>
              <div className={styles.stat}>
                <span className={styles.statNum}>$11B</span>
                <span className={styles.statLabel}>Toys R Us ATH</span>
              </div>
              <div className={styles.statDivider}>→</div>
              <div className={styles.stat}>
                <span className={styles.statNum}>$PLUSH</span>
                <span className={styles.statLabel}>Our target</span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className={styles.howItWorks}>
          <h2>How it works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>01</span>
              <h3>Submit your photo</h3>
              <p>Any PFP, meme, avatar, or portrait. The machine accepts all inputs.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>02</span>
              <h3>The Plushifier gets to work</h3>
              <p>Your image goes into the machine. An exact plush replica comes out.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>03</span>
              <h3>Receive plush + 1/1 NFT</h3>
              <p>Your plush ships to your door. Your NFT mints to your wallet. No two alike. Ever.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className={styles.ctaBanner}>
          <h2>Your PFP. But soft. 🧸</h2>
          <p>The factory is warming up. $PLUSH holders get first access.</p>
          <a href="https://pump.fun" className={styles.ctaPrimary} target="_blank" rel="noopener noreferrer">
            Get $PLUSH on Pump.fun
          </a>
        </section>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <p>© 2025 Plushify · <a href="https://x.com/ThePlushifier" target="_blank" rel="noopener noreferrer">@ThePlushifier</a> · $PLUSH on Pump.fun</p>
          <p className={styles.disclaimer}>$PLUSH is a meme coin. Not financial advice. Do your own research.</p>
        </footer>

      </main>
    </div>
  )
}
