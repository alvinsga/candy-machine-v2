<script lang="ts">
  import { onMount } from "svelte";
  import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
  import { Program, Provider, web3 } from "@project-serum/anchor";
  import { CANDY_MACHINE_PROGRAM } from "./lib/helpers";
  import { getMetadata } from "./lib/get-metadata";
  import { mintOneToken } from "./lib/mint";
  import { awaitTransactionSignatureConfirmation } from "./lib/connection";
  import { fade } from "svelte/transition";
  import type { CandyMachineAccount } from "./models";
  import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

  /***********************************/
  // Customise the app by changing the following variables.
  const TITLE = "Shapes";
  const DESCRTIPTION = "A collection of shapes on the blockchain";
  const HEADER_TITLE = "";
  const HEADER_LINK = "";
  // Your image or GIF needs to be in the /public folder for this to work
  const IMAGE_LINK = "/example.gif";
  /***********************************/

  const { solana } = window as any;
  const cluster = import.meta.env.VITE_APP_SOLANA_NETWORK.toString();
  const rpcUrl = import.meta.env.VITE_APP_SOLANA_RPC_HOST.toString();
  const txTimeout = 30000;
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
  let candyMachine: CandyMachineAccount;
  let isMinting = false;
  let mintSuccessful = false;
  let userBalance = 0;
  let siteLoading = true;
  let solanaExplorerLink = "";
  let isSoldOut = false;
  let isActive = false;
  let price = 0;
  let userWhitelisted = false;

  $: date = new Date(candyMachine?.state.goLiveDate?.toNumber() * 1000);
  $: whitelistToken = candyMachine?.state.whitelistMintSettings?.mint;
  $: whitelistPrice = candyMachine?.state.whitelistMintSettings?.discountPrice;

  async function checkWalletConnected() {
    try {
      const response = await solana.connect({ onlyIfTrusted: true });
      walletPublicKey = response.publicKey.toString();
      if (response) {
        await getUserBalance();
        await existsOwnerSPLToken();
      }
    } catch (error) {}
  }

  async function connectWallet() {
    try {
      const response = await solana.connect();
      walletPublicKey = response.publicKey.toString();
      if (response) {
        await getUserBalance();
        await existsOwnerSPLToken();
      }
    } catch (error) {}
  }

  async function getCandyMachineState() {
    try {
      const idl = await Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider);
      const program = new Program(idl, CANDY_MACHINE_PROGRAM, provider);
      candyMachine = await getMetadata(program, candyMachineId);
      ({ itemsAvailable, itemsRedeemed, isSoldOut, price, isActive } =
        candyMachine.state);
    } catch (error) {
      console.error(error);
    }
  }

  async function mint() {
    try {
      isMinting = true;
      if (candyMachine?.program && walletPublicKey) {
        const mint = web3.Keypair.generate();
        const mintTxId = (
          await mintOneToken(
            candyMachine,
            new web3.PublicKey(walletPublicKey),
            mint
          )
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
          displaySuccess(mint.publicKey);
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

  async function existsOwnerSPLToken() {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      new web3.PublicKey(walletPublicKey),
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );
    for (let index = 0; index < tokenAccounts.value.length; index++) {
      const tokenAccount = tokenAccounts.value[index];
      const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;

      const mint = tokenAccount.account.data.parsed.info.mint;
      if (mint === whitelistToken.toString() && tokenAmount.uiAmount > 0) {
        console.log("Welcome to the whitelist!");
        userWhitelisted = true;
      }
    }
  }

  function displaySuccess(mintPublicKey: web3.PublicKey) {
    // It takes time before state change is cascaded across the network
    // so we update this variables manually upon successful completion
    itemsRedeemed += 1;
    mintSuccessful = true;
    solanaExplorerLink = `https://explorer.solana.com/address/${mintPublicKey}?cluster=${cluster}`;
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
    }
    siteLoading = false;
  });
</script>

<main class="h-screen">
  <!-- Loading Section -->
  {#if siteLoading}
    <div class=" h-full flex">
      <div class="lds-hourglass m-auto" />
    </div>
  {:else}
    <!-- Menu Bar -->
    {#if HEADER_TITLE}
      <a
        href={HEADER_LINK}
        class="text-white tracking-widest underline underline-offset-4 decoration-2 font-mono"
        >{HEADER_TITLE}</a
      >
    {/if}
    <!-- Card -->
    <div
      class=" max-w-lg mx-auto bg-white rounded-lg my-12  border-2"
      transition:fade
    >
      <!-- Top Bar -->
      <div class="justify-{userWhitelisted ? 'between' : 'end'} flex p-3">
        {#if userWhitelisted}
          <div class="flex">
            <img src="/star.svg" alt="" class="w-5 mr-2" />
            <div class="my-auto text-gray-600 text-sm">Whitelist</div>
          </div>
        {/if}
        <div class="flex">
          {#if !walletPublicKey}
            <span class="my-auto mr-2 rounded-full h-2 w-2 bg-gray-500" />
            <span class=" my-auto text-gray-600 text-sm"> Not Connected </span>
          {:else}
            <div class=" flex flex-col">
              <div class="flex">
                <span class="my-auto mr-2 rounded-full h-2 w-2 bg-green-500" />
                <span class=" my-auto text-gray-600 text-sm">
                  {walletPublicKey.slice(0, 8)}
                </span>
              </div>
              <div class=" text-xs text-gray-600 text-right ">
                {(userBalance / LAMPORTS_PER_SOL).toFixed(2)} SOL
              </div>
            </div>
          {/if}
        </div>
      </div>
      <hr />
      <br />
      <!-- Main Body -->
      <div class="p-6">
        <img src={IMAGE_LINK} alt="" class=" w-1/2 mx-auto m-5" />
        <div
          class=" text-lg sm:text-2xl font-mono font-bold py-5 tracking-wider"
        >
          {TITLE}
        </div>
        <div class="text-sm sm:text-md font-semibold pb-5 text-gray-600 ">
          {DESCRTIPTION}
        </div>
        <div class="flex flex-col">
          {#if !solana}
            <button
              class=" px-3 py-2 rounded-md  bg-sky-600  hover:bg-sky-700 text-white font-bold"
              on:click={() => window.open("https://phantom.app/", "_blank")}
              >Get Phantom Wallet</button
            >
          {:else if !walletPublicKey}
            <button
              class=" px-3 py-2 rounded-md  bg-sky-600  hover:bg-sky-700 text-white font-bold"
              on:click={connectWallet}>Connect</button
            >
          {:else if !isActive && !userWhitelisted}
            <button
              class=" px-3 py-2 rounded-md  bg-sky-600  hover:bg-sky-700 text-white font-bold disabled:bg-gray-400 "
              disabled={true}>Mint live @ {date.toUTCString()}</button
            >
          {:else if isSoldOut}
            <button
              class=" px-3 py-2 rounded-md  bg-sky-600  hover:bg-sky-700 text-white font-bold "
              >Sold Out!</button
            >
          {:else}
            <button
              class=" px-3 py-2 rounded-md  bg-sky-600  hover:bg-sky-700 text-white font-bold disabled:bg-gray-400"
              disabled={isMinting}
              on:click={mint}
            >
              {#if isMinting}
                <span>Minting ...</span>
              {:else if mintSuccessful}
                <span>Mint succesful! Mint another?</span>
              {:else}
                <span
                  >Mint ({(
                    (userWhitelisted ? whitelistPrice : price) /
                    LAMPORTS_PER_SOL
                  ).toFixed(2)} SOL)</span
                >
              {/if}
            </button>
          {/if}
        </div>
        <div class=" tracking-widest font-bold text-sm pt-3 text-gray-400">
          {itemsRedeemed}/{itemsAvailable} claimed
        </div>
        <div class="flex flex-col pt-3">
          {#if solanaExplorerLink}
            <a
              href={solanaExplorerLink}
              target="_blank"
              class="text-purple-700 font-semibold  p-1"
              >View on Solana Explorer</a
            >
          {/if}
        </div>
      </div>
    </div>
  {/if}
</main>
