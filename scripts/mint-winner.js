#!/usr/bin/env node
/**
 * Standalone NFT minting script for Plushify winners
 * Usage: node scripts/mint-winner.js <wallet> <image_url> "<name>"
 *
 * Requires env:
 * - MINT_KEYPAIR: JSON array of secret key bytes
 * - SOLANA_NETWORK: mainnet-beta or devnet
 */

require('dotenv').config();
const { Connection, Keypair, clusterApiUrl, PublicKey } = require('@solana/web3.js');
const { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } = require('@metaplex-foundation/js');
const axios = require('axios');

async function mintWinner(walletAddress, imageUrl, name) {
  console.log(`\n🧸 Minting 1/1 NFT for ${name} → ${walletAddress}\n`);

  const secretKey = JSON.parse(process.env.MINT_KEYPAIR);
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
  const network = process.env.SOLANA_NETWORK || 'devnet';

  console.log(`Network: ${network}`);
  console.log(`Minting authority: ${keypair.publicKey.toString()}`);

  const connection = new Connection(clusterApiUrl(network), 'confirmed');
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(keypair))
    .use(bundlrStorage());

  // Download + upload image
  console.log('📦 Uploading image to Arweave...');
  const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const imgBuffer = Buffer.from(imgRes.data);
  const metaplexFile = toMetaplexFile(imgBuffer, 'plush.png');
  const imageUri = await metaplex.storage().upload(metaplexFile);
  console.log(`✅ Image: ${imageUri}`);

  // Upload metadata
  console.log('📝 Uploading metadata...');
  const { uri: metadataUri } = await metaplex.nfts().uploadMetadata({
    name: `Plushify 1/1 — ${name}`,
    description: 'A 1/1 plush NFT minted by The Plushifier. This is the only one. Ever.',
    image: imageUri,
    attributes: [
      { trait_type: 'Type', value: '1/1 Winner' },
      { trait_type: 'Minted By', value: 'The Plushifier' },
      { trait_type: 'Collection', value: 'Plushify Arena' },
    ],
  });
  console.log(`✅ Metadata: ${metadataUri}`);

  // Mint
  console.log(`🎨 Minting NFT to ${walletAddress}...`);
  const { nft, response } = await metaplex.nfts().create({
    uri: metadataUri,
    name: `Plushify 1/1 — ${name}`,
    sellerFeeBasisPoints: 500,
    tokenOwner: new PublicKey(walletAddress),
  });

  console.log(`\n✅ NFT MINTED!`);
  console.log(`   Address: ${nft.address.toString()}`);
  console.log(`   Tx: ${response.signature}`);
  console.log(`   View: https://solscan.io/token/${nft.address.toString()}`);
}

const [,, wallet, image, name] = process.argv;
if (!wallet || !image || !name) {
  console.error('Usage: node mint-winner.js <wallet> <image_url> "<name>"');
  process.exit(1);
}

mintWinner(wallet, image, name).catch(console.error);
