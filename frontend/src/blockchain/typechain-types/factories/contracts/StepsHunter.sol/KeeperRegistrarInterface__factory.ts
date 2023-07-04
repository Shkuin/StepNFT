/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  KeeperRegistrarInterface,
  KeeperRegistrarInterfaceInterface,
} from "../../../contracts/StepsHunter.sol/KeeperRegistrarInterface";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "encryptedEmail",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "upkeepContract",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "gasLimit",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "adminAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "checkData",
        type: "bytes",
      },
      {
        internalType: "uint96",
        name: "amount",
        type: "uint96",
      },
      {
        internalType: "uint8",
        name: "source",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class KeeperRegistrarInterface__factory {
  static readonly abi = _abi;
  static createInterface(): KeeperRegistrarInterfaceInterface {
    return new utils.Interface(_abi) as KeeperRegistrarInterfaceInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): KeeperRegistrarInterface {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as KeeperRegistrarInterface;
  }
}
