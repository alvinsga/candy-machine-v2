<script lang="ts">
  import { onMount } from "svelte";
  import { Connection, PublicKey } from "@solana/web3.js";
  import { Program, Provider, web3 } from "@project-serum/anchor";
  import { MintLayout, TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";

  const { solana } = window as any;
  const network = import.meta.env.VITE_APP_SOLANA_NETWORK.toString();
  const rpcUrl = import.meta.env.VITE_APP_SOLANA_RPC_HOST.toString();
  const candyMachineID = import.meta.env.VITE_APP_CANDY_MACHINE_ID.toString();
  const opts = {
    preflightCommitment: "processed",
  };
  let walletPublicKey = "";

  async function checkWalletConnected() {
    const response = await solana.connect({ onlyIfTrusted: true });
    walletPublicKey = response.publicKey.toString();
    console.log("Connected with Public Key:", response.publicKey.toString());
  }

  async function connectWallet() {
    const response = await solana.connect();
    walletPublicKey = response.publicKey.toString();
  }

  function getProvider() {
    const connection = new Connection(rpcUrl);
    // Create a new Solana provider object
    const provider = new Provider(
      connection,
      solana,
      opts.preflightCommitment as web3.ConfirmOptions
    );
    return provider;
  }

  function getCandyMachineState() {
    const provider = getProvider();
  }

  onMount(async () => {
    if (solana) {
      if (solana.isPhantom) await checkWalletConnected();
    } else {
      console.log("get Phantom");
    }
  });
</script>

<main>
  <h1 class=" text-2xl">{walletPublicKey}</h1>
  <button on:click={connectWallet}>Connect Wallet</button>
</main>
