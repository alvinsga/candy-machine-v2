<script lang="ts">
  import { onMount } from "svelte";
  import { Connection, PublicKey } from "@solana/web3.js";
  import { Program, Provider, web3 } from "@project-serum/anchor";
  import { MintLayout, TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
  import { programs } from "@metaplex/js";
  import { candyMachineProgram } from "./lib/helpers";
  import { getMetadata } from "./lib/get-metadata";

  const { solana } = window as any;
  const network = import.meta.env.VITE_APP_SOLANA_NETWORK.toString();
  const rpcUrl = import.meta.env.VITE_APP_SOLANA_RPC_HOST.toString();
  const candyMachineId = import.meta.env.VITE_APP_CANDY_MACHINE_ID.toString();
  const opts = { preflightCommitment: "processed" };

  const connection = new Connection(rpcUrl);
  const provider = new Provider(
    connection,
    solana,
    opts.preflightCommitment as web3.ConfirmOptions
  );

  let walletPublicKey = "";
  let itemsRedeemed = "";
  let itemsAvailable = "";

  async function checkWalletConnected() {
    const response = await solana.connect({ onlyIfTrusted: true });
    walletPublicKey = response.publicKey.toString();
    console.log("Connected with Public Key:", response.publicKey.toString());
  }

  async function connectWallet() {
    const response = await solana.connect();
    walletPublicKey = response.publicKey.toString();
  }

  async function getCandyMachineState() {
    const idl = await Program.fetchIdl(candyMachineProgram, provider);
    const program = new Program(idl, candyMachineProgram, provider);
    ({ itemsAvailable, itemsRedeemed } = await getMetadata(
      program,
      candyMachineId
    ));
  }

  onMount(async () => {
    await getCandyMachineState();
    if (solana) {
      if (solana.isPhantom) await checkWalletConnected();
    } else {
      console.log("get Phantom");
    }
  });
</script>

<main>
  <h1 class=" text-2xl">{walletPublicKey}</h1>
  <div>Available: {itemsAvailable}</div>
  <div>Redeemed: {itemsRedeemed}</div>
  <button on:click={connectWallet}>Connect Wallet</button>
  <button on:click={getCandyMachineState}>Get state</button>
  <button on:click={getCandyMachineState}>Mint</button>
</main>
