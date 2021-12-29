import type { Idl, Program, web3 } from "@project-serum/anchor";

export const getMetadata = async (
  program: Program<Idl>,
  candyMachineId: web3.PublicKey
) => {
  const state: any = await program.account.candyMachine.fetch(candyMachineId);
  const itemsAvailable = state.data.itemsAvailable.toNumber();
  const itemsRedeemed = state.itemsRedeemed.toNumber();
  const itemsRemaining = itemsAvailable - itemsRedeemed;

  return {
    id: candyMachineId,
    program,
    state: {
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      isSoldOut: itemsRemaining === 0,
      isActive:
        state.data.goLiveDate.toNumber() < new Date().getTime() / 1000 &&
        (state.endSettings
          ? state.endSettings.endSettingType.date
            ? state.endSettings.number.toNumber() > new Date().getTime() / 1000
            : itemsRedeemed < state.endSettings.number.toNumber()
          : true),
      goLiveDate: state.data.goLiveDate,
      treasury: state.wallet,
      tokenMint: state.tokenMint,
      gatekeeper: state.data.gatekeeper,
      endSettings: state.data.endSettings,
      whitelistMintSettings: state.data.whitelistMintSettings,
      hiddenSettings: state.data.hiddenSettings,
      price: state.data.price,
    },
  };
};
