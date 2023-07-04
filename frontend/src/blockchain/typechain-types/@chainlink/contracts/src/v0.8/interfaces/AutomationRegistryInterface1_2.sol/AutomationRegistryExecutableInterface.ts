/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../../../common";

export type StateStruct = {
  nonce: PromiseOrValue<BigNumberish>;
  ownerLinkBalance: PromiseOrValue<BigNumberish>;
  expectedLinkBalance: PromiseOrValue<BigNumberish>;
  numUpkeeps: PromiseOrValue<BigNumberish>;
};

export type StateStructOutput = [number, BigNumber, BigNumber, BigNumber] & {
  nonce: number;
  ownerLinkBalance: BigNumber;
  expectedLinkBalance: BigNumber;
  numUpkeeps: BigNumber;
};

export type ConfigStruct = {
  paymentPremiumPPB: PromiseOrValue<BigNumberish>;
  flatFeeMicroLink: PromiseOrValue<BigNumberish>;
  blockCountPerTurn: PromiseOrValue<BigNumberish>;
  checkGasLimit: PromiseOrValue<BigNumberish>;
  stalenessSeconds: PromiseOrValue<BigNumberish>;
  gasCeilingMultiplier: PromiseOrValue<BigNumberish>;
  minUpkeepSpend: PromiseOrValue<BigNumberish>;
  maxPerformGas: PromiseOrValue<BigNumberish>;
  fallbackGasPrice: PromiseOrValue<BigNumberish>;
  fallbackLinkPrice: PromiseOrValue<BigNumberish>;
  transcoder: PromiseOrValue<string>;
  registrar: PromiseOrValue<string>;
};

export type ConfigStructOutput = [
  number,
  number,
  number,
  number,
  number,
  number,
  BigNumber,
  number,
  BigNumber,
  BigNumber,
  string,
  string
] & {
  paymentPremiumPPB: number;
  flatFeeMicroLink: number;
  blockCountPerTurn: number;
  checkGasLimit: number;
  stalenessSeconds: number;
  gasCeilingMultiplier: number;
  minUpkeepSpend: BigNumber;
  maxPerformGas: number;
  fallbackGasPrice: BigNumber;
  fallbackLinkPrice: BigNumber;
  transcoder: string;
  registrar: string;
};

export interface AutomationRegistryExecutableInterfaceInterface
  extends utils.Interface {
  functions: {
    "addFunds(uint256,uint96)": FunctionFragment;
    "cancelUpkeep(uint256)": FunctionFragment;
    "checkUpkeep(uint256,address)": FunctionFragment;
    "getActiveUpkeepIDs(uint256,uint256)": FunctionFragment;
    "getKeeperInfo(address)": FunctionFragment;
    "getState()": FunctionFragment;
    "getUpkeep(uint256)": FunctionFragment;
    "performUpkeep(uint256,bytes)": FunctionFragment;
    "registerUpkeep(address,uint32,address,bytes)": FunctionFragment;
    "setUpkeepGasLimit(uint256,uint32)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addFunds"
      | "cancelUpkeep"
      | "checkUpkeep"
      | "getActiveUpkeepIDs"
      | "getKeeperInfo"
      | "getState"
      | "getUpkeep"
      | "performUpkeep"
      | "registerUpkeep"
      | "setUpkeepGasLimit"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addFunds",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelUpkeep",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "checkUpkeep",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getActiveUpkeepIDs",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getKeeperInfo",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "getState", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getUpkeep",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "performUpkeep",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerUpkeep",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setUpkeepGasLimit",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "addFunds", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "cancelUpkeep",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "checkUpkeep",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getActiveUpkeepIDs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getKeeperInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getState", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getUpkeep", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "performUpkeep",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerUpkeep",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setUpkeepGasLimit",
    data: BytesLike
  ): Result;

  events: {};
}

export interface AutomationRegistryExecutableInterface extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AutomationRegistryExecutableInterfaceInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addFunds(
      id: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    cancelUpkeep(
      id: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    checkUpkeep(
      upkeepId: PromiseOrValue<BigNumberish>,
      from: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getActiveUpkeepIDs(
      startIndex: PromiseOrValue<BigNumberish>,
      maxCount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    getKeeperInfo(
      query: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, boolean, BigNumber] & {
        payee: string;
        active: boolean;
        balance: BigNumber;
      }
    >;

    getState(
      overrides?: CallOverrides
    ): Promise<[StateStructOutput, ConfigStructOutput, string[]]>;

    getUpkeep(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        number,
        string,
        BigNumber,
        string,
        string,
        BigNumber,
        BigNumber
      ] & {
        target: string;
        executeGas: number;
        checkData: string;
        balance: BigNumber;
        lastKeeper: string;
        admin: string;
        maxValidBlocknumber: BigNumber;
        amountSpent: BigNumber;
      }
    >;

    performUpkeep(
      id: PromiseOrValue<BigNumberish>,
      performData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    registerUpkeep(
      target: PromiseOrValue<string>,
      gasLimit: PromiseOrValue<BigNumberish>,
      admin: PromiseOrValue<string>,
      checkData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setUpkeepGasLimit(
      id: PromiseOrValue<BigNumberish>,
      gasLimit: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addFunds(
    id: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  cancelUpkeep(
    id: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  checkUpkeep(
    upkeepId: PromiseOrValue<BigNumberish>,
    from: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getActiveUpkeepIDs(
    startIndex: PromiseOrValue<BigNumberish>,
    maxCount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  getKeeperInfo(
    query: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [string, boolean, BigNumber] & {
      payee: string;
      active: boolean;
      balance: BigNumber;
    }
  >;

  getState(
    overrides?: CallOverrides
  ): Promise<[StateStructOutput, ConfigStructOutput, string[]]>;

  getUpkeep(
    id: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [
      string,
      number,
      string,
      BigNumber,
      string,
      string,
      BigNumber,
      BigNumber
    ] & {
      target: string;
      executeGas: number;
      checkData: string;
      balance: BigNumber;
      lastKeeper: string;
      admin: string;
      maxValidBlocknumber: BigNumber;
      amountSpent: BigNumber;
    }
  >;

  performUpkeep(
    id: PromiseOrValue<BigNumberish>,
    performData: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  registerUpkeep(
    target: PromiseOrValue<string>,
    gasLimit: PromiseOrValue<BigNumberish>,
    admin: PromiseOrValue<string>,
    checkData: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setUpkeepGasLimit(
    id: PromiseOrValue<BigNumberish>,
    gasLimit: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addFunds(
      id: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    cancelUpkeep(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    checkUpkeep(
      upkeepId: PromiseOrValue<BigNumberish>,
      from: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
        performData: string;
        maxLinkPayment: BigNumber;
        gasLimit: BigNumber;
        adjustedGasWei: BigNumber;
        linkEth: BigNumber;
      }
    >;

    getActiveUpkeepIDs(
      startIndex: PromiseOrValue<BigNumberish>,
      maxCount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getKeeperInfo(
      query: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, boolean, BigNumber] & {
        payee: string;
        active: boolean;
        balance: BigNumber;
      }
    >;

    getState(
      overrides?: CallOverrides
    ): Promise<[StateStructOutput, ConfigStructOutput, string[]]>;

    getUpkeep(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        number,
        string,
        BigNumber,
        string,
        string,
        BigNumber,
        BigNumber
      ] & {
        target: string;
        executeGas: number;
        checkData: string;
        balance: BigNumber;
        lastKeeper: string;
        admin: string;
        maxValidBlocknumber: BigNumber;
        amountSpent: BigNumber;
      }
    >;

    performUpkeep(
      id: PromiseOrValue<BigNumberish>,
      performData: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    registerUpkeep(
      target: PromiseOrValue<string>,
      gasLimit: PromiseOrValue<BigNumberish>,
      admin: PromiseOrValue<string>,
      checkData: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setUpkeepGasLimit(
      id: PromiseOrValue<BigNumberish>,
      gasLimit: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    addFunds(
      id: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    cancelUpkeep(
      id: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    checkUpkeep(
      upkeepId: PromiseOrValue<BigNumberish>,
      from: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getActiveUpkeepIDs(
      startIndex: PromiseOrValue<BigNumberish>,
      maxCount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getKeeperInfo(
      query: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getState(overrides?: CallOverrides): Promise<BigNumber>;

    getUpkeep(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    performUpkeep(
      id: PromiseOrValue<BigNumberish>,
      performData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    registerUpkeep(
      target: PromiseOrValue<string>,
      gasLimit: PromiseOrValue<BigNumberish>,
      admin: PromiseOrValue<string>,
      checkData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setUpkeepGasLimit(
      id: PromiseOrValue<BigNumberish>,
      gasLimit: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addFunds(
      id: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    cancelUpkeep(
      id: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    checkUpkeep(
      upkeepId: PromiseOrValue<BigNumberish>,
      from: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getActiveUpkeepIDs(
      startIndex: PromiseOrValue<BigNumberish>,
      maxCount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getKeeperInfo(
      query: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getState(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getUpkeep(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    performUpkeep(
      id: PromiseOrValue<BigNumberish>,
      performData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    registerUpkeep(
      target: PromiseOrValue<string>,
      gasLimit: PromiseOrValue<BigNumberish>,
      admin: PromiseOrValue<string>,
      checkData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setUpkeepGasLimit(
      id: PromiseOrValue<BigNumberish>,
      gasLimit: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
