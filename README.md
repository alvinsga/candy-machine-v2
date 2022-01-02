# Candy Machine V2 Frontend

This is a barebones implementation of Candy Machine V2 frontend, intended for users who want to quickly get started selling Solana NFT's. It DOES NOT include captcha yet - we plan to make this feature available in a future release. Some code has been ported from the Fair Launch Protocol frontend in the Metaplex repo. This has been tested with candy machine programs on both devnet and mainnet-beta.

The app was built using Svelte + Vite and uses TailwindCSS for styles.

An example site built using this frontend: https://lanablocks.xyz

![demo gif](https://github.com/alvinsga/candy-machine-v2/blob/master/public/demo.gif "Demo Gif")


## One-click deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Falvinsga%2Fcandy-machine-v2&env=VITE_APP_CANDY_MACHINE_ID,VITE_APP_SOLANA_NETWORK,VITE_APP_SOLANA_RPC_HOST&envDescription=Populate%20your%20candy%20machine%20public%20key%2C%20the%20solana%20network(devnet%2Fmainet)%20and%20the%20RPC%20URL>)

## Getting started

### Populate the following environment variables in the .env file:

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
