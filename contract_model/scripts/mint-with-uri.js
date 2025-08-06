async function main() {
    const [signer] = await ethers.getSigners();
    const FACTORY = "0xYourFactoryAddress";       // 替换成你的 Factory 地址
    const COLLECTION = "0xYourCollectionAddress"; // 替换成你要铸的那个集合地址
    const RECIPIENT = await signer.getAddress();
    const METADATA_URI = "ipfs://QmYourMetadataCID"; // 或者任何 HTTP/HTTPS 链接

    // 拿到工厂合约实例
    const Factory = await ethers.getContractFactory("NFTFactory");
    const factory = Factory.attach(FACTORY);

    // 调用 mintInCollection 并传入 URI
    const tx = await factory.mintInCollection(
        COLLECTION,
        RECIPIENT,
        METADATA_URI
    );
    console.log("交易已发送，hash =", tx.hash);
    await tx.wait();
    console.log("✅ 铸造完成，URI =", METADATA_URI);
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    });

// npx hardhat run scripts/mint-with-uri.js