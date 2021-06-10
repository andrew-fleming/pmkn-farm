//// SPDX-License-Identifier: MIT
//pragma solidity 0.8.4;
//
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/utils/Counters.sol";
//
//contract JackOLantern is ERC721URIStorage {
//    using Counters for Counters.Counter;
//    Counters.Counter private _tokenIds;
//
//    constructor() ERC721("Jack-O'-Lantern", "JACK") {}
//
//    function mintItem(address player, string memory tokenURI)
//        public
//        returns (uint256)
//    {
//        _tokenIds.increment();
//
//        uint256 newItemId = _tokenIds.current();
//        _mint(player, newItemId);
//        _setTokenURI(newItemId, tokenURI);
//
//        return newItemId;
//    }
//}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract JackOLantern is AccessControl, ERC721URIStorage {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Jack-O-Lantern", "JACK") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function safeMint(address to) public {
        require(hasRole(MINTER_ROLE, msg.sender));
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mintItem(address player, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 tokenId = _tokenIdCounter.current();
        safeMint(player);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

}