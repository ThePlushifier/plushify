import Head from 'next/head'
import styles from '../styles/Home.module.css'

const PUMP_FUN_URL = 'https://pump.fun/coin/4B2obgHGfUYg9nEvENpnBv9WJut8pXtKDPHx4VsRpump'
const X_URL = 'https://x.com/ThePlushifier'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Plushify — Your PFP. But soft.</title>
        <meta
          name="description"
          content="The internet's toy factory. Submit any photo, meme, or PFP and get an exact plush replica made to order. Every plush comes with a 1/1 NFT. $PLUSH is live on Pump.fun."
        />
        <meta property="og:title" content="Plushify — Your PFP. But soft." />
        <meta
          property="og:description"
          content="Turn your PFP, meme, or avatar into a custom plush collectible. Back the mission with $PLUSH on Pump.fun."
        />
        <meta property="og:image" content="/mascot.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Plushify — Your PFP. But soft." />
        <meta
          name="twitter:description"
          content="The Biggest Toy Company on Solana starts here. Custom plush replicas, 1/1 NFTs, and $PLUSH on Pump.fun."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>The Biggest Toy Company on Solana</p>
            <h1 className={styles.headline}>
              Your PFP.<br />
              But soft.
            </h1>
            <p className={styles.subheadline}>
              The internet&apos;s toy factory is open.
              <br />
              Submit any photo — your PFP, your favorite meme, any avatar — and Plushify turns it into an exact plush replica made to order.
              <br />
              Every plush comes with a 1/1 NFT.
            </p>
            <div className={styles.ctaRow}>
              <a href="/plushify" className={styles.ctaPrimary}>
                🧸 Plushify your PFP
              </a>
              <a href={PUMP_FUN_URL} className={styles.ctaSecondary} target="_blank" rel="noopener noreferrer">
                Buy $PLUSH
              </a>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img src="/mascot.png" alt="The Plushifier" />
          </div>
        </section>

        <section className={styles.mission}>
          <div className={styles.missionInner}>
            <p className={styles.missionEyebrow}>The Mission</p>
            <h2>Flip Toys R Us.</h2>
            <p>
              Toys R Us hit an all-time-high valuation of $11B.
              <br />
              The old toy empire died.
              <br />
              We&apos;re building the internet-native replacement — meme-first, collectible-first, community-owned.
            </p>
            <div className={styles.statRow}>
              <div className={styles.stat}>
                <span className={styles.statNum}>$11B</span>
                <span className={styles.statLabel}>Toys R Us ATH</span>
              </div>
              <div className={styles.statDivider}>→</div>
              <div className={styles.stat}>
                <span className={styles.statNum}>$PLUSH</span>
                <span className={styles.statLabel}>The mission</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.howItWorks}>
          <h2>How it works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>01</span>
              <h3>Submit your image</h3>
              <p>Drop in any PFP, meme, portrait, mascot, or cursed little internet creature.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>02</span>
              <h3>The Plushifier works the machine</h3>
              <p>We turn the original into a plush design built to stay recognizable, weird, and collectible.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>03</span>
              <h3>Receive plush + 1/1 NFT</h3>
              <p>Your physical plush ships to your door. Your matching 1/1 NFT lands in your wallet.</p>
            </div>
          </div>
        </section>

        <section className={styles.howItWorks}>
          <h2>Token mechanics</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>77%</span>
              <h3>Buyback is live</h3>
              <p>PLUSH is configured as a tokenized agent with a live 77% buyback allocation. The machine can feed a huge share of agent-side revenue back into the token economy.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>10%</span>
              <h3>Supply reserved for production</h3>
              <p>Part of supply is locked around Plushify output, tying the token story to actual factory activity instead of pure vibes alone.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>$1</span>
              <h3>Per Plushify release cap</h3>
              <p>Each Plushify can unlock up to $1 worth of reserved supply, giving the production side a simple rule people can understand.</p>
            </div>
          </div>
        </section>

        <section className={styles.ctaBanner}>
          <h2>Not just a meme. A machine.</h2>
          <p>Buybacks, burns, locked production-linked supply, and a real toy factory mission — all pointed at one ridiculous goal.</p>
          <a href={PUMP_FUN_URL} className={styles.ctaPrimary} target="_blank" rel="noopener noreferrer">
            Get $PLUSH on Pump.fun
          </a>
        </section>

        <footer className={styles.footer}>
          <p>
            © 2026 Plushify · <a href={X_URL} target="_blank" rel="noopener noreferrer">@ThePlushifier</a> ·{' '}
            <a href={PUMP_FUN_URL} target="_blank" rel="noopener noreferrer">$PLUSH on Pump.fun</a>
          </p>
          <p className={styles.disclaimer}>$PLUSH is a meme coin. Not financial advice. Do your own research.</p>
        </footer>
      </main>
    </div>
  )
}
