// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
  
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC4906.sol";
import "./OnChainMetadata.sol"; 

contract ERC721OnChainMetadata is ERC721, IERC4906, OnChainMetadata
{  
  constructor(string memory name, string memory symbol) ERC721(name, symbol){ }
  
  function tokenURI(uint256 tokenId) public view virtual override(ERC721) returns (string memory)
  {
    require(_exists(tokenId), "tokenId doesn't exist");
    return _createTokenURI(tokenId);
  }

  function contractURI() public view virtual returns (string memory) { 
    return _createContractURI();
  }
}

 