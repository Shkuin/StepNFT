/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  ERC721OnChainMetadata,
  ERC721OnChainMetadataInterface,
} from "../../contracts/ERC721OnChainMetadata";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
    ],
    name: "BatchMetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "MetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200282e3803806200282e8339810160408190526200003491620001cb565b8151829082906200004d9060009060208501906200006e565b508051620000639060019060208401906200006e565b505050505062000288565b8280546200007c9062000235565b90600052602060002090601f016020900481019282620000a05760008555620000eb565b82601f10620000bb57805160ff1916838001178555620000eb565b82800160010185558215620000eb579182015b82811115620000eb578251825591602001919060010190620000ce565b50620000f9929150620000fd565b5090565b5b80821115620000f95760008155600101620000fe565b600082601f8301126200012657600080fd5b81516001600160401b038082111562000143576200014362000272565b604051601f8301601f19908116603f011681019082821181831017156200016e576200016e62000272565b816040528381526020925086838588010111156200018b57600080fd5b600091505b83821015620001af578582018301518183018401529082019062000190565b83821115620001c15760008385830101525b9695505050505050565b60008060408385031215620001df57600080fd5b82516001600160401b0380821115620001f757600080fd5b620002058683870162000114565b935060208501519150808211156200021c57600080fd5b506200022b8582860162000114565b9150509250929050565b600181811c908216806200024a57607f821691505b602082108114156200026c57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b61259680620002986000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806370a082311161008c578063b88d4fde11610066578063b88d4fde146101e1578063c87b56dd146101f4578063e8a3d48514610207578063e985e9c51461020f57600080fd5b806370a08231146101a557806395d89b41146101c6578063a22cb465146101ce57600080fd5b8063095ea7b3116100c8578063095ea7b31461015757806323b872dd1461016c57806342842e0e1461017f5780636352211e1461019257600080fd5b806301ffc9a7146100ef57806306fdde0314610117578063081812fc1461012c575b600080fd5b6101026100fd366004611b94565b610222565b60405190151581526020015b60405180910390f35b61011f610274565b60405161010e9190612277565b61013f61013a366004611c45565b610306565b6040516001600160a01b03909116815260200161010e565b61016a610165366004611b68565b61032d565b005b61016a61017a366004611a45565b610448565b61016a61018d366004611a45565b610479565b61013f6101a0366004611c45565b610494565b6101b86101b33660046119d2565b6104f4565b60405190815260200161010e565b61011f61057a565b61016a6101dc366004611b35565b610589565b61016a6101ef366004611a86565b610598565b61011f610202366004611c45565b6105d0565b61011f610638565b61010261021d366004611a0c565b610647565b60006001600160e01b031982166380ac58cd60e01b148061025357506001600160e01b03198216635b5e139f60e01b145b8061026e57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606000805461028390612463565b80601f01602080910402602001604051908101604052809291908181526020018280546102af90612463565b80156102fc5780601f106102d1576101008083540402835291602001916102fc565b820191906000526020600020905b8154815290600101906020018083116102df57829003601f168201915b5050505050905090565b600061031182610675565b506000908152600460205260409020546001600160a01b031690565b600061033882610494565b9050806001600160a01b0316836001600160a01b031614156103ab5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b03821614806103c757506103c78133610647565b6104395760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c00000060648201526084016103a2565b61044383836106d7565b505050565b6104523382610745565b61046e5760405162461bcd60e51b81526004016103a29061228a565b6104438383836107a4565b61044383838360405180602001604052806000815250610598565b6000818152600260205260408120546001600160a01b03168061026e5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016103a2565b60006001600160a01b03821661055e5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b60648201526084016103a2565b506001600160a01b031660009081526003602052604090205490565b60606001805461028390612463565b610594338383610908565b5050565b6105a23383610745565b6105be5760405162461bcd60e51b81526004016103a29061228a565b6105ca848484846109d7565b50505050565b6000818152600260205260409020546060906001600160a01b031661062f5760405162461bcd60e51b81526020600482015260156024820152741d1bdad95b925908191bd95cdb89dd08195e1a5cdd605a1b60448201526064016103a2565b61026e82610a0a565b6060610642610f24565b905090565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6000818152600260205260409020546001600160a01b03166106d45760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016103a2565b50565b600081815260046020526040902080546001600160a01b0319166001600160a01b038416908117909155819061070c82610494565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60008061075183610494565b9050806001600160a01b0316846001600160a01b0316148061077857506107788185610647565b8061079c5750836001600160a01b031661079184610306565b6001600160a01b0316145b949350505050565b826001600160a01b03166107b782610494565b6001600160a01b0316146107dd5760405162461bcd60e51b81526004016103a290612329565b6001600160a01b03821661083f5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016103a2565b826001600160a01b031661085282610494565b6001600160a01b0316146108785760405162461bcd60e51b81526004016103a290612329565b600081815260046020908152604080832080546001600160a01b03199081169091556001600160a01b0387811680865260038552838620805460001901905590871680865283862080546001019055868652600290945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b816001600160a01b0316836001600160a01b0316141561096a5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016103a2565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6109e28484846107a4565b6109ee848484846111dc565b6105ca5760405162461bcd60e51b81526004016103a2906122d7565b6060806000610a26846974726169745f7479706560b01b6112e9565b805190915015610c0757604051806040016040528060018152602001605b60f81b81525091506000610a66856a74726169745f76616c756560a81b6112e9565b90506000610a84866c74726169745f646973706c617960981b6112e9565b905060005b8351811015610be1578460008211610ab05760405180602001604052806000815250610acb565b604051806040016040528060018152602001600b60fa1b8152505b6000848481518110610adf57610adf6124c9565b60200260200101515111610b025760405180602001604052806000815250610b4f565b838381518110610b1457610b146124c9565b6020026020010151806020019051810190610b2f9190611bce565b604051602001610b3f9190611de8565b6040516020818303038152906040525b868481518110610b6157610b616124c9565b6020026020010151806020019051810190610b7c9190611bce565b868581518110610b8e57610b8e6124c9565b6020026020010151806020019051810190610ba99190611bce565b604051602001610bbd959493929190611cbf565b60405160208183030381529060405294508080610bd990612498565b915050610a89565b5083604051602001610bf39190611d7e565b604051602081830303815290604052935050505b6000610c1a85636e616d6560e01b6113da565b806020019051810190610c2d9190611bce565b90506000610c49866a3232b9b1b934b83a34b7b760a91b6113da565b806020019051810190610c5c9190611bce565b90506000610c728764696d61676560d81b6113da565b90506000610c90886c185b9a5b585d1a5bdb97dd5c9b609a1b6113da565b90506000610cad896b195e1d195c9b985b17dd5c9b60a21b6113da565b90506000610cce8a6f3130b1b5b3b937bab7322fb1b7b637b960811b6113da565b90506000610cea8b6a1e5bdd5d1d589957dd5c9b60aa1b6113da565b9050610ef587876000885111610d0f5760405180602001604052806000815250610d43565b87806020019051810190610d239190611bce565b604051602001610d339190611ebd565b6040516020818303038152906040525b6000885111610d615760405180602001604052806000815250610d95565b87806020019051810190610d759190611bce565b604051602001610d85919061220a565b6040516020818303038152906040525b6000885111610db35760405180602001604052806000815250610de7565b87806020019051810190610dc79190611bce565b604051602001610dd79190611e76565b6040516020818303038152906040525b60008f5111610e055760405180602001604052806000815250610e26565b8e604051602001610e1691906121d1565b6040516020818303038152906040525b6000895111610e445760405180602001604052806000815250610e78565b88806020019051810190610e589190611bce565b604051602001610e689190612158565b6040516020818303038152906040525b6000895111610e965760405180602001604052806000815250610eca565b88806020019051810190610eaa9190611bce565b604051602001610eba9190612197565b6040516020818303038152906040525b604051602001610ee1989796959493929190611fbd565b60405160208183030381529060405261142b565b604051602001610f059190612120565b6040516020818303038152906040529950505050505050505050919050565b60606000610f38636e616d6560e01b61157f565b90506000610f536a3232b9b1b934b83a34b7b760a91b61157f565b90506000610f6864696d61676560d81b61157f565b90506000610f856c65787465726e616c5f6c696e6b60981b61157f565b90506000610fb27f73656c6c65725f6665655f62617369735f706f696e747300000000000000000061157f565b90506000610fcf6c19995957dc9958da5c1a595b9d609a1b61157f565b90506111b286806020019051810190610fe89190611bce565b6000875111611006576040518060200160405280600081525061103a565b8680602001905181019061101a9190611bce565b60405160200161102a91906120aa565b6040516020818303038152906040525b6000875111611058576040518060200160405280600081525061108c565b8680602001905181019061106c9190611bce565b60405160200161107c9190611ebd565b6040516020818303038152906040525b60008751116110aa57604051806020016040528060008152506110de565b868060200190518101906110be9190611bce565b6040516020016110ce91906120f0565b6040516020818303038152906040525b60008751116110fc5760405180602001604052806000815250611138565b611118878060200190518101906111139190611c5e565b6115d5565b6040516020016111289190611da3565b6040516020818303038152906040525b6000875111611156576040518060200160405280600081525061119d565b61117d8780602001905181019061116d91906119ef565b6001600160a01b03166014611672565b60405160200161118d9190611e2e565b6040516020818303038152906040525b604051602001610ee196959493929190611efd565b6040516020016111c29190612120565b604051602081830303815290604052965050505050505090565b60006001600160a01b0384163b156112de57604051630a85bd0160e11b81526001600160a01b0385169063150b7a029061122090339089908890889060040161223a565b602060405180830381600087803b15801561123a57600080fd5b505af192505050801561126a575060408051601f3d908101601f1916820190925261126791810190611bb1565b60015b6112c4573d808015611298576040519150601f19603f3d011682016040523d82523d6000602084013e61129d565b606091505b5080516112bc5760405162461bcd60e51b81526004016103a2906122d7565b805181602001fd5b6001600160e01b031916630a85bd0160e11b14905061079c565b506001949350505050565b60008281526009602090815260408083208484526001018252808320805482518185028101850190935280835260609492939192909184015b828210156113ce57838290600052602060002001805461134190612463565b80601f016020809104026020016040519081016040528092919081815260200182805461136d90612463565b80156113ba5780601f1061138f576101008083540402835291602001916113ba565b820191906000526020600020905b81548152906001019060200180831161139d57829003601f168201915b505050505081526020019060010190611322565b50505050905092915050565b606060006113e884846112e9565b8051909150156114155780600081518110611405576114056124c9565b602002602001015191505061026e565b505060408051602081019091526000815261026e565b606081516000141561144b57505060408051602081019091526000815290565b6000604051806060016040528060408152602001612521604091399050600060038451600261147a91906123c7565b61148491906123df565b61148f906004612401565b67ffffffffffffffff8111156114a7576114a76124df565b6040519080825280601f01601f1916602001820160405280156114d1576020820181803683370190505b509050600182016020820185865187015b8082101561153d576003820191508151603f8160121c168501518453600184019350603f81600c1c168501518453600184019350603f8160061c168501518453600184019350603f81168501518453506001830192506114e2565b5050600386510660018114611559576002811461156c57611574565b603d6001830353603d6002830353611574565b603d60018303535b509195945050505050565b6060600061158c83611815565b8051909150156115b957806000815181106115a9576115a96124c9565b6020026020010151915050919050565b5050604080516020810190915260008152919050565b50919050565b606060006115e2836118fa565b600101905060008167ffffffffffffffff811115611602576116026124df565b6040519080825280601f01601f19166020018201604052801561162c576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a85049450846116655761166a565b611636565b509392505050565b60606000611681836002612401565b61168c9060026123c7565b67ffffffffffffffff8111156116a4576116a46124df565b6040519080825280601f01601f1916602001820160405280156116ce576020820181803683370190505b509050600360fc1b816000815181106116e9576116e96124c9565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110611718576117186124c9565b60200101906001600160f81b031916908160001a905350600061173c846002612401565b6117479060016123c7565b90505b60018111156117bf576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061177b5761177b6124c9565b1a60f81b828281518110611791576117916124c9565b60200101906001600160f81b031916908160001a90535060049490941c936117b88161244c565b905061174a565b50831561180e5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016103a2565b9392505050565b6000818152600760209081526040808320805482518185028101850190935280835260609492939192909184015b828210156118ef57838290600052602060002001805461186290612463565b80601f016020809104026020016040519081016040528092919081815260200182805461188e90612463565b80156118db5780601f106118b0576101008083540402835291602001916118db565b820191906000526020600020905b8154815290600101906020018083116118be57829003601f168201915b505050505081526020019060010190611843565b505050509050919050565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b83106119395772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310611965576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc10000831061198357662386f26fc10000830492506010015b6305f5e100831061199b576305f5e100830492506008015b61271083106119af57612710830492506004015b606483106119c1576064830492506002015b600a831061026e5760010192915050565b6000602082840312156119e457600080fd5b813561180e816124f5565b600060208284031215611a0157600080fd5b815161180e816124f5565b60008060408385031215611a1f57600080fd5b8235611a2a816124f5565b91506020830135611a3a816124f5565b809150509250929050565b600080600060608486031215611a5a57600080fd5b8335611a65816124f5565b92506020840135611a75816124f5565b929592945050506040919091013590565b60008060008060808587031215611a9c57600080fd5b8435611aa7816124f5565b93506020850135611ab7816124f5565b925060408501359150606085013567ffffffffffffffff811115611ada57600080fd5b8501601f81018713611aeb57600080fd5b8035611afe611af98261239f565b61236e565b818152886020838501011115611b1357600080fd5b8160208401602083013760006020838301015280935050505092959194509250565b60008060408385031215611b4857600080fd5b8235611b53816124f5565b915060208301358015158114611a3a57600080fd5b60008060408385031215611b7b57600080fd5b8235611b86816124f5565b946020939093013593505050565b600060208284031215611ba657600080fd5b813561180e8161250a565b600060208284031215611bc357600080fd5b815161180e8161250a565b600060208284031215611be057600080fd5b815167ffffffffffffffff811115611bf757600080fd5b8201601f81018413611c0857600080fd5b8051611c16611af98261239f565b818152856020838501011115611c2b57600080fd5b611c3c826020830160208601612420565b95945050505050565b600060208284031215611c5757600080fd5b5035919050565b600060208284031215611c7057600080fd5b5051919050565b60008151808452611c8f816020860160208601612420565b601f01601f19169290920160200192915050565b60008151611cb5818560208601612420565b9290920192915050565b60008651611cd1818460208b01612420565b865190830190611ce5818360208b01612420565b607b60f81b91019081528551611d02816001840160208a01612420565b6e113a3930b4ba2fba3cb832911d101160891b600192909101918201528451611d32816010840160208901612420565b6c111610113b30b63ab2911d101160991b601092909101918201528351611d6081601d840160208801612420565b61227d60f01b601d9290910191820152601f01979650505050505050565b60008251611d90818460208701612420565b605d60f81b920191825250600101919050565b7f2c202273656c6c65725f6665655f62617369735f706f696e7473223a20000000815260008251611ddb81601d850160208701612420565b91909101601d0192915050565b70113234b9b83630bcafba3cb832911d101160791b81528151600090611e15816011850160208701612420565b61088b60f21b6011939091019283015250601301919050565b731610113332b2afb932b1b4b834b2b73a111d101160611b81528151600090611e5e816014850160208701612420565b601160f91b6014939091019283015250601501919050565b7216101132bc3a32b93730b62fbab936111d101160691b81528151600090611ea5816013850160208701612420565b601160f91b6013939091019283015250601401919050565b6b16101134b6b0b3b2911d101160a11b81528151600090611ee581600c850160208701612420565b601160f91b600c939091019283015250600d01919050565b607b60f81b815268113730b6b2911d101160b91b600182015286516000906020611f2d82600a8601838d01612420565b601160f91b600a928501928301528851600b90611f4f81838601858e01612420565b8951930192611f6381838601858d01612420565b8851930192611f7781838601858c01612420565b8751930192611f8b81838601858b01612420565b8651930192611f9f81838601858a01612420565b607d60f81b93019081019290925250600c0198975050505050505050565b607b60f81b815268113730b6b2911d101160b91b60018201528851600090611fec81600a850160208e01612420565b6201116160ed1b600a918401918201526f113232b9b1b934b83a34b7b7111d101160811b600d820152895161202881601d840160208e01612420565b601160f91b601d9290910191820152885161204a81601e840160208d01612420565b885191019061206081601e840160208c01612420565b61209a61208d61208761208161207b601e868801018d611ca3565b8b611ca3565b89611ca3565b87611ca3565b607d60f81b815260010190565b9c9b505050505050505050505050565b711610113232b9b1b934b83a34b7b7111d101160711b815281516000906120d8816012850160208701612420565b601160f91b6012939091019283015250601301919050565b7316101132bc3a32b93730b62fb634b735911d101160611b81528151600090611e5e816014850160208701612420565b7f646174613a6170706c69636174696f6e2f6a736f6e3b6261736536342c000000815260008251611ddb81601d850160208701612420565b7501610113130b1b5b3b937bab7322fb1b7b637b9111d160551b8152815160009061218a816016850160208701612420565b9190910160160192915050565b7001610113cb7baba3ab132afbab936111d1607d1b815281516000906121c4816011850160208701612420565b9190910160110192915050565b6f016101130ba3a3934b13aba32b9911d160851b815281516000906121fd816010850160208701612420565b9190910160100192915050565b7316101130b734b6b0ba34b7b72fbab936111d101160611b81528151600090611e5e816014850160208701612420565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061226d90830184611c77565b9695505050505050565b60208152600061180e6020830184611c77565b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b604051601f8201601f1916810167ffffffffffffffff81118282101715612397576123976124df565b604052919050565b600067ffffffffffffffff8211156123b9576123b96124df565b50601f01601f191660200190565b600082198211156123da576123da6124b3565b500190565b6000826123fc57634e487b7160e01b600052601260045260246000fd5b500490565b600081600019048311821515161561241b5761241b6124b3565b500290565b60005b8381101561243b578181015183820152602001612423565b838111156105ca5750506000910152565b60008161245b5761245b6124b3565b506000190190565b600181811c9082168061247757607f821691505b602082108114156115cf57634e487b7160e01b600052602260045260246000fd5b60006000198214156124ac576124ac6124b3565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146106d457600080fd5b6001600160e01b0319811681146106d457600080fdfe4142434445464748494a4b4c4d4e4f505152535455565758595a6162636465666768696a6b6c6d6e6f707172737475767778797a303132333435363738392b2fa264697066735822122011c752ac2927e3ddce5a6662d9610723443a3e9848b2269661efad5e1cc1280f64736f6c63430008070033";

type ERC721OnChainMetadataConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721OnChainMetadataConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721OnChainMetadata__factory extends ContractFactory {
  constructor(...args: ERC721OnChainMetadataConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC721OnChainMetadata> {
    return super.deploy(
      name,
      symbol,
      overrides || {}
    ) as Promise<ERC721OnChainMetadata>;
  }
  override getDeployTransaction(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  override attach(address: string): ERC721OnChainMetadata {
    return super.attach(address) as ERC721OnChainMetadata;
  }
  override connect(signer: Signer): ERC721OnChainMetadata__factory {
    return super.connect(signer) as ERC721OnChainMetadata__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721OnChainMetadataInterface {
    return new utils.Interface(_abi) as ERC721OnChainMetadataInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC721OnChainMetadata {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ERC721OnChainMetadata;
  }
}