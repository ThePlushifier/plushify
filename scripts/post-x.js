#!/usr/bin/env node

const { TwitterApi } = require('twitter-api-v2');

async function main() {
  const text = process.argv.slice(2).join(' ').trim();

  if (!text) {
    console.error('Usage: npm run post:x -- "your post text"');
    process.exit(1);
  }

  const required = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    console.error(`Missing env vars: ${missing.join(', ')}`);
    process.exit(1);
  }

  const client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
  });

  const tweet = await client.v2.tweet(text);
  console.log(JSON.stringify(tweet, null, 2));
}

main().catch((err) => {
  console.error(err?.data || err?.message || err);
  process.exit(1);
});
