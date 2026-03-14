import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id, wallet, image, name } = req.body;

  if (!wallet) return res.status(400).json({ error: 'No wallet address provided. Winner needs to submit their wallet.' });

  try {
    const {
      Connection,
      Keypair,
      clusterApiUrl,
      PublicKey,
    } = require('@solana/web3.js');

    const { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } = require('@metaplex-foundation/js');
    const axios = require('axios');

    // Load minting keypair from env
    const secretKey = JSON.parse(process.env.MINT_KEYPAIR || '[]');
    if (!secretKey.length) return res.status(500).json({ error: 'MINT_KEYPAIR not configured. Add treasury wallet keypair to env.' });

    const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(keypair))
      .use(bundlrStorage());

    // Download image
    const imgRes = await axios.get(image, { responseType: 'arraybuffer' });
    const imgBuffer = Buffer.from(imgRes.data);
    const metaplexFile = toMetaplexFile(imgBuffer, 'plush.png');

    // Upload image to Arweave via Bundlr
    const imageUri = await metaplex.storage().upload(metaplexFile);

    // Upload metadata
    const { uri: metadataUri } = await metaplex.nfts().uploadMetadata({
      name: `Plushify 1/1 — ${name || 'Anonymous'}`,
      description: 'A 1/1 plush NFT minted by The Plushifier. This is the only one. Ever.',
      image: imageUri,
      attributes: [
        { trait_type: 'Type', value: '1/1 Winner' },
        { trait_type: 'Minted By', value: 'The Plushifier' },
        { trait_type: 'Collection', value: 'Plushify Arena' },
      ],
      properties: {
        files: [{ uri: imageUri, type: 'image/png' }],
        creators: [{ address: keypair.publicKey.toString(), share: 100 }],
      },
    });

    // Mint NFT
    const { nft, response } = await metaplex.nfts().create({
      uri: metadataUri,
      name: `Plushify 1/1 — ${name || 'Anonymous'}`,
      sellerFeeBasisPoints: 500, // 5% royalties
      tokenOwner: new PublicKey(wallet),
    });

    // Update DB
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    await supabase.from('submissions').update({
      nft_minted: true,
      nft_address: nft.address.toString(),
      nft_tx: response.signature,
    }).eq('id', id);

    res.status(200).json({ ok: true, signature: response.signature, nft: nft.address.toString() });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
