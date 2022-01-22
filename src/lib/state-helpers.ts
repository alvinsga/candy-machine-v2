import { getMetadata } from "../lib/get-metadata";
import { CANDY_MACHINE_PROGRAM } from "../lib/helpers";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { Connection } from "@solana/web3.js";

export async function getCandyMachineState(
  candyMachineId: web3.PublicKey,
  provider: Provider
) {
  try {
    const idl = await Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider);
    const program = new Program(idl, CANDY_MACHINE_PROGRAM, provider);
    return await getMetadata(program, candyMachineId);
  } catch (error) {
    console.error(error);
  }
}

export async function checkWalletConnected(solana: any) {
  try {
    const response = await solana.connect({ onlyIfTrusted: true });
    return response.publicKey.toString();
  } catch (error) {
    console.log("Unlock your wallet!");
  }
}

export async function getUserBalance(
  walletPublicKey: string,
  connection: Connection
) {
  const pk = new web3.PublicKey(walletPublicKey);
  try {
    return await connection.getBalance(pk);
  } catch (error) {
    console.error(error);
  }
}

export async function existsOwnerSPLToken(
  walletPublicKey: string,
  connection: Connection,
  whitelistToken: web3.PublicKey
) {
  try {
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
        return true;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function connectWallet(solana: any) {
  try {
    const response = await solana.connect();
    return response.publicKey.toString();
  } catch (error) {
    console.error(error);
  }
}
