// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./ERC721Template.sol";

contract NFTFactory {

    // 记录所有集合地址
    address[] public allCollections;
    // 将每个集合地址映射到它的创建者
    mapping(address => address) public creatorOf;

    event CollectionCreated(address indexed collection, address indexed creator, string name, string symbol);
    event NFTMinted(address indexed collection, address indexed to, uint256 indexed tokenId, string tokenURI);

    /// @notice 部署一个新的 ERC721Template 合约
    function createCollection(string calldata name, string calldata symbol) external {
        // 在链上部署模板合约，模板中的 factory 会被设为本合约地址
        ERC721Template col = new ERC721Template(name, symbol);
        allCollections.push(address(col));
        // 记录创建者
        creatorOf[address(col)] = msg.sender;
        emit CollectionCreated(address(col), msg.sender, name, symbol);
    }

    /// @notice 返回所有部署过的 Collection 地址列表
    function getCollections() external view returns (address[] memory) {
        return allCollections;
    }

    /// @notice 仅允许当初创建该集合的账户来铸造 NFT
    /// @param collection 已部署的 ERC721Template 地址
    /// @param to      铸给哪个地址
    function mintInCollection(address collection, address to) external {
        require(creatorOf[collection] == msg.sender, "NFTFactory: caller is not creator");
        // 调用模板合约 mint（模板合约内部会校验 msg.sender == factory）
        ERC721Template(collection).mint(to);
    }

    /// 仅创建者可铸造并附带 metadata URI
    function mintInCollection(address collection, address to, string calldata tokenURI) external {
        require(creatorOf[collection] == msg.sender, "not creator");
        ERC721Template tpl = ERC721Template(collection);
        tpl.mintWithURI(to, tokenURI);
        uint256 mintedId = tpl.nextTokenId() - 1;
        emit NFTMinted(collection, to, mintedId, tokenURI);
    }

    ///修改指定的NFT baseUrl
    function updateTokenURI(
        address collection,
        uint256 tokenId,
        string calldata newURI
    ) external {
        require(creatorOf[collection] == msg.sender, "not creator");
        ERC721Template(collection).updateTokenURI(tokenId, newURI);
    }
}
