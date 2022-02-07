# Candy Machine V2 Frontend

This is a barebones implementation of Candy Machine V2 frontend, intended for users who want to quickly get started selling Solana NFT's. Some code has been ported from the Fair Launch Protocol frontend in the Metaplex repo. This has been tested with Candy Machine programs on both devnet and mainnet-beta.

The app was built using Svelte + Vite and uses TailwindCSS for styles.

This is code is open-sourced from SolaRare @ https://solarare.com, a Candy Machine Mint Page generator.

![solarare](https://user-images.githubusercontent.com/44920747/152659230-2c97b634-d8c1-415e-b9a7-ad7057d2f5a3.png)

## Getting started

### Rename the .env.example file to .env and populate the following environment variables:

Required:

```
- VITE_APP_CANDY_MACHINE_ID=
- VITE_APP_SOLANA_NETWORK=
- VITE_APP_SOLANA_RPC_HOST=
```

Optional:
Populate with your Google Analytics Measurement ID (in the format G-XXXXXXXXXX)

```
- VITE_APP_GOOGLE_ANALYTICS=
```

### Example configuration
Devnet:
```
- VITE_APP_SOLANA_NETWORK=devnet
- VITE_APP_SOLANA_RPC_HOST=https://explorer-api.devnet.solana.com
```

Mainnet-beta:
```
- VITE_APP_SOLANA_NETWORK=mainnet-beta
- VITE_APP_SOLANA_RPC_HOST=https://api.mainnet-beta.solana.com
```

### Edit the following variables in App.svelte to match your project:

```
- TITLE
- DESCRIPTION
- IMAGE_LINK
- HEADER_TITLE
- HEADER_LINK
```

### Then run:

```
- yarn install
- yarn dev
```

## Features

- Automatically fetches items minted, total quantity and price from the candy machine state
- Whitelist token detection and whitelist price updates
- 'View on Solana Explorer' after transaction has been broadcasted
- Confetti after a successful mint
- Google Analytics tracking

## Support
SOL: AfJEqYhgfMipRkAej9dMbEoxdfbwcCVyTAU3mjS29VZ2


