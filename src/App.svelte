<script lang="ts">
  import { onMount } from "svelte";
  import { Connection } from "@solana/web3.js";
  import { Provider, web3 } from "@project-serum/anchor";
  import { fade } from "svelte/transition";
  import Button from "./components/Button.svelte";
  import Header from "./components/CardHeader.svelte";

  import { candyMachineState, userState } from "./lib/store";
  import {
    getCandyMachineState,
    checkWalletConnected,
    getUserBalance,
    existsOwnerSPLToken,
  } from "./lib/state-helpers";

  /***********************************/
  // Customise the app by changing the following variables.
  const TITLE = "Shapes";
  const DESCRTIPTION = "A collection of shapes on the blockchain";
  const HEADER_TITLE = "shapes.xyz";
  const HEADER_LINK = "https://lanablocks.xyz";
  // Your image or GIF needs to be in the /public folder for this to work
  const IMAGE_LINK = "/example.gif";
  /***********************************/

  const { solana } = window as any;
  const rpcUrl = import.meta.env.VITE_APP_SOLANA_RPC_HOST.toString();
  const candyMachineId = import.meta.env.VITE_APP_CANDY_MACHINE_ID.toString();
  const candyMachinePublicKey = new web3.PublicKey(candyMachineId);
  const opts = { preflightCommitment: "processed" };
  const connection = new Connection(rpcUrl);
  const provider = new Provider(
    connection,
    solana,
    opts.preflightCommitment as web3.ConfirmOptions
  );

  let siteLoading = true;

  $: itemsRedeemed = $candyMachineState?.state.itemsRedeemed;
  $: itemsAvailable = $candyMachineState?.state.itemsAvailable;

  onMount(async () => {
    $candyMachineState = await getCandyMachineState(
      candyMachinePublicKey,
      provider
    );

    if (solana?.isPhantom) {
      $userState.walletPublicKey = await checkWalletConnected(solana);
      if ($userState.walletPublicKey) {
        // Get User Balance
        $userState.userBalance = await getUserBalance(
          $userState.walletPublicKey,
          connection
        );
        // Check if user is whitelisted (ie. check if they have token)
        $userState.isWhiteListed = await existsOwnerSPLToken(
          $userState.walletPublicKey,
          connection,
          $candyMachineState.state.whitelistMintSettings.mint
        );
      }
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
        class="text-black tracking-widest underline underline-offset-4 decoration-2 font-mono"
        >{HEADER_TITLE}</a
      >
    {/if}
    <!-- Card -->
    <div
      class=" max-w-lg mx-auto bg-white rounded-lg my-12  border-2"
      transition:fade
    >
      <!-- Top Bar -->
      <Header />
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
        <Button {solana} {connection} />

        <div class=" tracking-widest font-bold text-sm pt-3 text-gray-400">
          {itemsRedeemed}/{itemsAvailable} claimed
        </div>
        <div class="flex flex-col pt-3">
          {#if $userState.solanaExplorerLink}
            <a
              href={$userState.solanaExplorerLink}
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
