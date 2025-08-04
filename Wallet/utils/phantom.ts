import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import bs58 from 'bs58';

const DAPP_URL = 'walletapp://';

export const connectPhantom = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    const encodedDappUrl = encodeURIComponent(DAPP_URL);
    const connectUrl = https://phantom.app/ul/v1/connect?app_url=${encodedDappUrl}&redirect_link=${encodedDappUrl};

    const handleRedirect = ({ url }: { url: string }) => {
      const match = url.match(/public_key=([^&]+)/);
      if (match) {
        const pubKey = decodeURIComponent(match[1]);
        resolve(pubKey);
      } else {
        resolve(null);
      }
      Linking.removeAllListeners('url');
    };

    Linking.addEventListener('url', handleRedirect);
    Linking.openURL(connectUrl);
  });
};

export const sendTransaction = async (
  fromPubkeyBase58: string,
  toPubkeyBase58: string,
  solAmount: number
): Promise<string> => {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  const fromPubkey = new PublicKey(fromPubkeyBase58);
  const toPubkey = new PublicKey(toPubkeyBase58);
  const lamports = solAmount * 1e9;

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  );

  tx.feePayer = fromPubkey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const serializedTx = tx.serialize({ requireAllSignatures: false });
  const encodedTx = bs58.encode(serializedTx);
  const encodedDappUrl = encodeURIComponent(DAPP_URL);

  const txUrl = https://phantom.app/ul/v1/signAndSendTransaction?app_url=${encodedDappUrl}&redirect_link=${encodedDappUrl}&transaction=${encodedTx}&cluster=devnet;

  return new Promise((resolve, reject) => {
    const handleTx = ({ url }: { url: string }) => {
      const match = url.match(/signature=([^&]+)/);
      if (match) {
        resolve(decodeURIComponent(match[1]));
      } else {
        reject(new Error('Transaction rejected or cancelled.'));
      }
      Linking.removeAllListeners('url');
    };

    Linking.addEventListener('url', handleTx);
    WebBrowser.openBrowserAsync(txUrl);
  });
};