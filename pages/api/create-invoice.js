import { Connection, PublicKey, Transaction, ComputeBudgetProgram } from "@solana/web3.js";
import { PumpAgent } from "@pump-fun/agent-payments-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ error: "No wallet provided" });

  try {
    const connection = new Connection(process.env.SOLANA_RPC_URL || "https://rpc.solanatracker.io/public");
    const agentMint = new PublicKey(process.env.AGENT_TOKEN_MINT_ADDRESS || "So11111111111111111111111111111111111111112");
    const currencyMint = new PublicKey("So11111111111111111111111111111111111111112"); // wSOL
    const agent = new PumpAgent(agentMint, "mainnet", connection);
    const userPublicKey = new PublicKey(wallet);

    // Generate invoice params
    const memo = String(Math.floor(Math.random() * 900000000000) + 100000);
    const now = Math.floor(Date.now() / 1000);
    const startTime = String(now);
    const endTime = String(now + 86400); // 24 hours
    const amount = "100000000"; // 0.1 SOL in lamports

    const instructions = await agent.buildAcceptPaymentInstructions({
      user: userPublicKey,
      currencyMint,
      amount,
      memo,
      startTime,
      endTime,
    });

    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userPublicKey;
    tx.add(
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 }),
      ...instructions
    );

    const serializedTx = tx.serialize({ requireAllSignatures: false }).toString("base64");

    res.status(200).json({ transaction: serializedTx, memo, startTime, endTime, amount });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
