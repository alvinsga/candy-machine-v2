# Candy Machine V2 Frontend

This is a barebones implementation of Candy Machine V2 frontend, intended for users who want to quickly get started selling Solana NFT's. This DOES NOT include captcha yetn - we plan to make this feature available in a future release. Some code has been ported from the Fair Launch Protocol frontend in the Metaplex repo.

This app was built using Svelte + Vite and uses TailwindCSS for styles.

## Getting started

Populate the following environment variables in the .env file:
```
- VITE_APP_CANDY_MACHINE_ID=
- VITE_APP_SOLANA_NETWORK=
- VITE_APP_SOLANA_RPC_HOST=
```
You can use the following configuration for the devnet:
```
- VITE_APP_SOLANA_NETWORK=devnet
- VITE_APP_SOLANA_RPC_HOST=https://explorer-api.devnet.solana.com
```
Edit the following variables in App.svelte to match your project:
```
- TITLE
- DESCRIPTION
- IMAGE_LINK
- HEADER_TITLE
- HEADER_LINK
```
Then run:
```
- yarn install
- yarn dev
```
