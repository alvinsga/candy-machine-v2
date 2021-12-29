import type { Idl, Program } from "@project-serum/anchor";

export async function getMetadata(
  program: Program<Idl>,
  candyMachineId: string
) {
  const candyMachine = await program.account.candyMachine.fetch(candyMachineId);
  // Parse out all our metadata and log it out
  const itemsAvailable = candyMachine.data.itemsAvailable.toNumber();
  const itemsRedeemed = candyMachine.itemsRedeemed.toNumber();
  const itemsRemaining = itemsAvailable - itemsRedeemed;
  const goLiveData = candyMachine.data.goLiveDate.toNumber();

  // We will be using this later in our UI so let's generate this now
  const goLiveDateTimeString = `${new Date(goLiveData * 1000).toUTCString()}`;

  return {
    itemsAvailable,
    itemsRedeemed,
    itemsRemaining,
    goLiveData,
    goLiveDateTimeString,
  };
}
