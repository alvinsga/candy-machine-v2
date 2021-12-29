<script lang="ts">
  import { onMount } from "svelte";
  import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
  import { Program, Provider, web3 } from "@project-serum/anchor";
  import { CANDY_MACHINE_PROGRAM } from "./lib/helpers";
  import { getMetadata } from "./lib/get-metadata";
  import { mintOneToken } from "./lib/mint";
  import { awaitTransactionSignatureConfirmation } from "./lib/connection";
  import type { CandyMachineAccount } from "./models";

  const { solana } = window as any;
  const txTimeout = 30000;
  const rpcUrl = import.meta.env.VITE_APP_SOLANA_RPC_HOST.toString();
  const candyMachineId = new web3.PublicKey(
    import.meta.env.VITE_APP_CANDY_MACHINE_ID.toString()
  );
  const opts = { preflightCommitment: "processed" };
  const connection = new Connection(rpcUrl);
  const provider = new Provider(
    connection,
    solana,
    opts.preflightCommitment as web3.ConfirmOptions
  );

  let walletPublicKey = "";
  let itemsRedeemed = 0;
  let itemsAvailable = 0;
  let candyMachine: CandyMachineAccount = null;
  let isMinting = false;
  let message = "";
  let userBalance = 0;

  async function checkWalletConnected() {
    const response = await solana.connect({ onlyIfTrusted: true });
    walletPublicKey = response.publicKey.toString();
    console.log("Connected with Public Key:", response.publicKey.toString());
    await getUserBalance();
  }

  async function connectWallet() {
    const response = await solana.connect();
    walletPublicKey = response.publicKey.toString();
    await getUserBalance();
  }

  async function getCandyMachineState() {
    try {
      const idl = await Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider);
      const program = new Program(idl, CANDY_MACHINE_PROGRAM, provider);
      candyMachine = await getMetadata(program, candyMachineId);
      ({ itemsAvailable, itemsRedeemed } = candyMachine.state);
    } catch (error) {
      console.error(error);
    }
  }

  async function mint() {
    try {
      isMinting = true;
      if (candyMachine?.program && walletPublicKey) {
        const mintTxId = (
          await mintOneToken(candyMachine, new web3.PublicKey(walletPublicKey))
        )[0];
        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            txTimeout,
            connection,
            "singleGossip",
            true
          );
        }
        if (!status?.err) {
          console.log("Success");
          temporarilyChangeQuantity();
        } else {
          console.error("An error occurred");
        }
      }
    } catch (error: any) {
      console.error("An error occurred ", error);
    } finally {
      isMinting = false;
    }
  }

  function temporarilyChangeQuantity() {
    // It takes time before state change is cascaded across the network
    // so we update this variables manually upon successful completion
    itemsRedeemed += 1;
  }

  async function getUserBalance() {
    const pk = new web3.PublicKey(walletPublicKey);
    try {
      userBalance = await connection.getBalance(pk);
    } catch (error) {
      console.error(error);
    }
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
  <div>{userBalance / LAMPORTS_PER_SOL}</div>
  <div>{message}</div>
  <div>{isMinting}</div>
  <button on:click={connectWallet}>Connect Wallet</button>
  <button on:click={getCandyMachineState}>Get state</button>
  <button on:click={mint}>Mint</button>
</main>
