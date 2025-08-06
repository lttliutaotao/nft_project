// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title 可由工厂合约铸造的 ERC-721 模板
contract ERC721Template is ERC721URIStorage {

    uint256 public nextTokenId;
    address public factory;

    // 我们依旧让模板合约只信任工厂合约来铸造，保持了安全边界。
    /// @param name 合约名称
    /// @param symbol 合约符号
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        factory = msg.sender;
    }

    /// @notice 仅 Factory 可调用，为指定地址铸造新 Token
    function mint(address to) external {
        require(msg.sender == factory, "ERC721Template: only factory");
        _safeMint(to, nextTokenId);
        nextTokenId += 1;
    }

    /// @notice 仅 Factory 可调用，铸造并设置 metadata URI
    function mintWithURI(address to, string calldata tokenURI_) external {
        require(msg.sender == factory, "only factory");
        uint256 id = nextTokenId;
        nextTokenId += 1;
        _safeMint(to, id);
        _setTokenURI(id, tokenURI_);
    }


    /// @notice 可选：只允许 Factory 修改默认 Base URI
    function _baseURI() internal view virtual override returns (string memory) {
        return super._baseURI();
    }

    function updateTokenURI(uint256 tokenId, string calldata newURI) external {
        require(msg.sender == factory, "only factory");
        _setTokenURI(tokenId, newURI);
    }



}
