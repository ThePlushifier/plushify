import Head from "next/head";
import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Transaction } from "@solana/web3.js";
import styles from "../styles/Randomizer.module.css";

async function signAndSendPayment(txBase64, signTransaction, connection) {
  const tx = Transaction.from(Buffer.from(txBase64, "base64"));
  const signedTx = await signTransaction(tx);
  const signature = await connection.sendRawTransaction(signedTx.serialize(), {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  });
  const latestBlockhash = await connection.getLatestBlockhash("confirmed");
  await connection.confirmTransaction({ signature, ...latestBlockhash }, "confirmed");
  return signature;
}

export default function Randomizer() {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const [state, setState] = useState("idle"); // idle | creating | signing | verifying | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState(null);

  const handlePay = async () => {
    if (!publicKey || !signTransaction) return;
    setError(null);
    setResult(null);

    try {
      // Step 1: Create invoice + build transaction
      setState("creating");
      const invoiceRes = await fetch("/api/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: publicKey.toBase58() }),
      });
      const invoiceData = await invoiceRes.json();
      if (invoiceData.error) throw new Error(invoiceData.error);
      setInvoice(invoiceData);

      // Step 2: Sign + send
      setState("signing");
      await signAndSendPayment(invoiceData.transaction, signTransaction, connection);

      // Step 3: Verify + get number
      setState("verifying");
      const verifyRes = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          memo: invoiceData.memo,
          startTime: invoiceData.startTime,
          endTime: invoiceData.endTime,
          amount: invoiceData.amount,
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.error) throw new Error(verifyData.error);

      setResult(verifyData.number);
      setState("done");
    } catch (e) {
      setError(e.message);
      setState("error");
    }
  };

  const reset = () => { setState("idle"); setResult(null); setError(null); setInvoice(null); };

  const statusText = {
    idle: null,
    creating: "Building transaction...",
    signing: "Waiting for wallet approval...",
    verifying: "Verifying payment on-chain...",
    done: null,
    error: null,
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>Plushify Randomizer — Pay 0.1 SOL, Get a Number</title>
      </Head>

      <header className={styles.header}>
        <a href="/" className={styles.logo}>🧸 Plushify</a>
        <WalletMultiButton className={styles.walletBtn} />
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.eyebrow}>Powered by $PLUSH</div>
          <h1>Random Number Generator</h1>
          <p className={styles.sub}>
            Pay <strong>0.1 SOL</strong> → get a verified random number between 0 and 1000.<br />
            Payment verified on-chain before your number is revealed.
          </p>

          {!connected ? (
            <div className={styles.connectWrap}>
              <p className={styles.connectHint}>Connect your wallet to begin</p>
              <WalletMultiButton />
            </div>
          ) : state === "done" ? (
            <div className={styles.resultWrap}>
              <div className={styles.resultLabel}>Your number</div>
              <div className={styles.resultNumber}>{result}</div>
              <div className={styles.resultSub}>Payment verified on-chain ✅</div>
              <button className={styles.resetBtn} onClick={reset}>Generate again</button>
            </div>
          ) : state === "error" ? (
            <div className={styles.errorWrap}>
              <p className={styles.errorText}>⚠️ {error}</p>
              <button className={styles.resetBtn} onClick={reset}>Try again</button>
            </div>
          ) : (
            <div className={styles.payWrap}>
              {statusText[state] && (
                <div className={styles.status}>
                  <div className={styles.spinner} />
                  <span>{statusText[state]}</span>
                </div>
              )}
              <button
                className={styles.payBtn}
                onClick={handlePay}
                disabled={state !== "idle"}
              >
                {state === "idle" ? "Pay 0.1 SOL → Generate number" : "Processing..."}
              </button>
              <p className={styles.walletInfo}>
                Connected: {publicKey?.toBase58().slice(0, 6)}...{publicKey?.toBase58().slice(-4)}
              </p>
            </div>
          )}
        </div>

        <div className={styles.how}>
          <h2>How it works</h2>
          <div className={styles.steps}>
            <div className={styles.step}><span>1</span><p>Connect your Solana wallet</p></div>
            <div className={styles.step}><span>2</span><p>Pay 0.1 SOL — transaction built server-side</p></div>
            <div className={styles.step}><span>3</span><p>Payment verified on-chain</p></div>
            <div className={styles.step}><span>4</span><p>Random number revealed (0–1000)</p></div>
          </div>
        </div>
      </main>
    </div>
  );
}
