import type { CandyMachineAccount, UserState } from "src/models";
import { writable } from "svelte/store";

export const candyMachineState = writable<CandyMachineAccount>();
export const userState = writable<UserState>({
  walletPublicKey: "",
  userBalance: 0,
  isWhiteListed: false,
  solanaExplorerLink: "",
});
