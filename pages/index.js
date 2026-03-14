import Head from 'next/head'
import styles from '../styles/Home.module.css'

const PUMP_FUN_URL = 'https://pump.fun/coin/4B2obgHGfUYg9nEvENpnBv9WJut8pXtKDPHx4VsRpump'
const X_URL = 'https://x.com/ThePlushifier'
const STREAMFLOW_LINKS = [
  'https://app.streamflow.finance/contract/solana/mainnet/BL9KeGbaV64WS8N9D4T7PALGGUGFw3Vbvhg8eBsZq2Wh',
  'https://app.streamflow.finance/contract/solana/mainnet/7nNHuUCEc8hdxzoNAfhMKg9SmLwaeiJCBpimrAeAGpU9',
  'https://app.streamflow.finance/contract/solana/mainnet/3kmfVYSntg1FpdzjtzKsSNM7sq55TeMQ42SUC5EQ57rr',
  'https://app.streamflow.finance/contract/solana/mainnet/RJDdMizeeS35g76U2w2tNmVxh1Vs5zButhafCo9SqDC',
  'https://app.streamflow.finance/contract/solana/mainnet/DvYEW5SGh1yoRyvbWo3kksDgwxGFiahZJVDpEvB3o9No',
]

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
            <div className={styles.heroBadgeRow}>
              <span className={styles.heroBadge}>Tokenized agent</span>
              <span className={styles.heroBadge}>77% buyback live</span>
              <span className={styles.heroBadge}>104.9977M locked / vesting</span>
            </div>
            <p className={styles.eyebrow}>The Biggest Toy Company on Solana</p>
            <h1 className={styles.headline}>
              The internet&apos;s<br />
              toy factory.
            </h1>
            <p className={styles.subheadline}>
              Plushify turns PFPs, memes, mascots, and cursed little internet creatures into custom plush collectibles.
              <br />
              The mission is simple: build a toy company that feels native to the internet, native to crypto, and impossible to ignore.
            </p>
            <div className={styles.ctaRow}>
              <a href="/plushify" className={styles.ctaPrimary}>
                🧸 Plushify your PFP
              </a>
              <a href={PUMP_FUN_URL} className={styles.ctaSecondary} target="_blank" rel="noopener noreferrer">
                Buy $PLUSH
              </a>
            </div>
            <div className={styles.quickProof}>
              <div>
                <strong>77%</strong>
                <span>tokenized-agent buyback</span>
              </div>
              <div>
                <strong>104.9977M</strong>
                <span>locked / vesting in Streamflow</span>
              </div>
              <div>
                <strong>4 + 1</strong>
                <span>linear locks + price-based vesting fund</span>
              </div>
            </div>
          </div>

          <div className={styles.heroImageWrap}>
            <div className={styles.heroOrb}></div>
            <div className={styles.heroImage}>
              <img src="/mascot.png" alt="The Plushifier" />
            </div>
            <div className={styles.floatingCard + ' ' + styles.cardOne}>
              <span>Factory status</span>
              <strong>ONLINE</strong>
            </div>
            <div className={styles.floatingCard + ' ' + styles.cardTwo}>
              <span>Mission</span>
              <strong>Flip Toys R Us</strong>
            </div>
          </div>
        </section>

        <section className={styles.proofStrip}>
          <div className={styles.proofItem}>
            <span className={styles.proofLabel}>Ticker</span>
            <strong>$PLUSH</strong>
          </div>
          <div className={styles.proofItem}>
            <span className={styles.proofLabel}>Positioning</span>
            <strong>Your PFP. But soft.</strong>
          </div>
          <div className={styles.proofItem}>
            <span className={styles.proofLabel}>Model</span>
            <strong>token + product + factory</strong>
          </div>
          <div className={styles.proofItem}>
            <span className={styles.proofLabel}>Receipts</span>
            <strong>public, onchain, auditable</strong>
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
              Plushify is building the internet-native replacement: meme-first, collectible-first, community-owned, and fully online.
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
          <h2>How the factory works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>01</span>
              <h3>Submit your image</h3>
              <p>Drop in any PFP, meme, portrait, mascot, or strange internet artifact worth immortalizing in plush form.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>02</span>
              <h3>The Plushifier interprets it</h3>
              <p>The machine keeps the spirit intact while turning the original into a plush concept built to feel collectible, weird, and exact enough to matter.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>03</span>
              <h3>Physical plush + 1/1 NFT</h3>
              <p>Every successful Plushify is meant to become a real object and a matching digital collectible, tied back to the same factory mythology.</p>
            </div>
          </div>
        </section>

        <section className={styles.manifesto}>
          <div className={styles.sectionIntro}>
            <p className={styles.missionEyebrow}>Why this hits different</p>
            <h2>Not just a meme coin. Not just a merch site.</h2>
          </div>
          <div className={styles.manifestoGrid}>
            <div className={styles.manifestoCard}>
              <h3>Tokenized agent</h3>
              <p>The Plushifier isn&apos;t only branding. It&apos;s an actual agent with token-linked mechanics and a growing posting / factory loop.</p>
            </div>
            <div className={styles.manifestoCard}>
              <h3>Real product narrative</h3>
              <p>There&apos;s a product people instantly understand: take any internet identity and turn it into something you can actually hold.</p>
            </div>
            <div className={styles.manifestoCard}>
              <h3>Internet-native toy company</h3>
              <p>Plushify is building the kind of toy brand that only makes sense after memes, PFPs, crypto, and online identity all collided.</p>
            </div>
          </div>
        </section>

        <section className={styles.howItWorks}>
          <h2>Token mechanics</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>77%</span>
              <h3>Buyback is live</h3>
              <p>PLUSH is configured as a tokenized agent with a live 77% buyback allocation, feeding a huge share of agent-side revenue back into the token economy.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>10%</span>
              <h3>Supply reserved for production</h3>
              <p>Part of supply is locked around Plushify output, tying the token story to actual factory activity instead of empty vibes.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>$1</span>
              <h3>Per-Plushify release cap</h3>
              <p>Each Plushify can unlock up to $1 worth of reserved supply, creating a simple bridge between product output and token structure.</p>
            </div>
          </div>
        </section>

        <section className={styles.transparencySection}>
          <div className={styles.sectionIntro}>
            <p className={styles.missionEyebrow}>Transparency</p>
            <h2>Receipts, not vibes.</h2>
            <p className={styles.sectionCopy}>
              The lock stack is public. The Streamflow contracts are live. Anyone can inspect the supply structure directly.
            </p>
          </div>

          <div className={styles.transparencyGrid}>
            <div className={styles.transparencyPanel}>
              <div className={styles.transparencyTop}>
                <span>Total locked / vesting</span>
                <strong>104.9977M PLUSH</strong>
              </div>
              <ul className={styles.breakdownList}>
                <li><span>Linear contract</span><strong>18.7654M</strong></li>
                <li><span>Linear contract</span><strong>23.2323M</strong></li>
                <li><span>Linear contract</span><strong>19M</strong></li>
                <li><span>Linear contract</span><strong>19M</strong></li>
                <li><span>Price-based vesting fund</span><strong>25M</strong></li>
              </ul>
            </div>

            <div className={styles.transparencyPanel}>
              <div className={styles.transparencyTop}>
                <span>Contract structure</span>
                <strong>4 linear + 1 price-based</strong>
              </div>
              <div className={styles.linkList}>
                {STREAMFLOW_LINKS.map((link) => (
                  <a key={link} href={link} target="_blank" rel="noopener noreferrer">
                    {link.replace('https://app.streamflow.finance/contract/solana/mainnet/', '')}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaBanner}>
          <h2>The machine is online.</h2>
          <p>Buybacks, public locks, product narrative, and a factory voice that posts like it knows it&apos;s alive. That&apos;s the Plushify stack.</p>
          <div className={styles.ctaRowCenter}>
            <a href={PUMP_FUN_URL} className={styles.ctaPrimary} target="_blank" rel="noopener noreferrer">
              Get $PLUSH on Pump.fun
            </a>
            <a href={X_URL} className={styles.ctaSecondary} target="_blank" rel="noopener noreferrer">
              Follow @ThePlushifier
            </a>
          </div>
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
