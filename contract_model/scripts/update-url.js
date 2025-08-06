const hre = require("hardhat");

async function main() {
// 1. 配置：替换成你自己的地址
    const FACTORY_ADDRESS    = "0xYourFactoryAddress";      // NFTFactory 部署地址
    const COLLECTION_ADDRESS = "0xYourCollectionAddress";   // 目标 ERC721Template 合约地址
    const TOKEN_ID           = 3;                           // 想要更新的 Token ID
    const NEW_TOKEN_URI      = "ipfs://QmNewMetadataCID";   // 新的 metadata URI

    // 2. 获取 signer
    const [caller] = await hre.ethers.getSigners();
    console.log("调用者地址:", caller.address);

    // 3. 获取 NFTFactory 合约实例
    const Factory = await hre.ethers.getContractFactory("NFTFactory");
    const factory = Factory.attach(FACTORY_ADDRESS);

    // 4. 发起交易：更新 Token URI
    const tx = await factory.updateTokenURI(
        COLLECTION_ADDRESS,
        TOKEN_ID,
        NEW_TOKEN_URI
    );
    console.log(`交易已发送，hash = ${tx.hash}`);
    await tx.wait();
    console.log(`✅ Token ${TOKEN_ID} 的 URI 已更新为 ${NEW_TOKEN_URI}`);
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });