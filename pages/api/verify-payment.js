import { PublicKey, Connection } from "@solana/web3.js";
import { PumpAgent } from "@pump-fun/agent-payments-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { wallet, memo, startTime, endTime, amount } = req.body;
  if (!wallet || !memo || !startTime || !endTime || !amount) {
    return res.status(400).json({ error: "Missing invoice params" });
  }

  try {
    const connection = new Connection(process.env.SOLANA_RPC_URL || "https://rpc.solanatracker.io/public");
    const agentMint = new PublicKey(process.env.AGENT_TOKEN_MINT_ADDRESS || "So11111111111111111111111111111111111111112");
    const agent = new PumpAgent(agentMint, "mainnet", connection);

    const invoiceParams = {
      user: new PublicKey(wallet),
      currencyMint: new PublicKey("So11111111111111111111111111111111111111112"),
      amount: Number(amount),
      memo: Number(memo),
      startTime: Number(startTime),
      endTime: Number(endTime),
    };

    // Retry up to 10 times (20 seconds)
    let verified = false;
    for (let i = 0; i < 10; i++) {
      verified = await agent.validateInvoicePayment(invoiceParams);
      if (verified) break;
      await new Promise(r => setTimeout(r, 2000));
    }

    if (!verified) return res.status(402).json({ error: "Payment not confirmed" });

    // Generate random number 0-1000
    const randomNumber = Math.floor(Math.random() * 1001);
    res.status(200).json({ verified: true, number: randomNumber });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
