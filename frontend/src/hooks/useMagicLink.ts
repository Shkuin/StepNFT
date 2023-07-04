import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { OAuthExtension } from '@magic-ext/oauth';

export const apiKey = process.env.REACT_APP_MAGIC_LINK_API_KEY as string;
export const rpcUrl = process.env.REACT_APP_POLYGON_RPC_URL as string;

const customNodeOptions = {
  rpcUrl,
  chainId: 80001,
};

export const magic = new Magic(apiKey, {
  network: customNodeOptions,
  extensions: [new OAuthExtension()],
});


export const provider = new ethers.providers.Web3Provider(magic.rpcProvider as any);

export const useMagicLink = () => {
  return { magic, provider };
};
