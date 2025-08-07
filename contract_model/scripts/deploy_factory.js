const { ethers } = require("hardhat")

async function main(){
    //先获取第一个账号 也是部署者的账号
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with:", deployer.address);
    const NFTFactorys = await ethers.getContractFactory("NFTFactory");
    const NFTFactory = await NFTFactorys.deploy();
    console.log(`NFTFactory address ${NFTFactory.target}`)
    // 获取NFT工厂所属人
    const owner = await NFTFactory.getOwner();
    console.log(`nft factory owner address ${owner}`)

    //创建NFT集合
    console.log(`create nft collection ....`)
    await NFTFactory.createCollection("fristNft",'fnft')
    await NFTFactory.createCollection("secendNft",'snft')
    console.log(`create done`)

    // 获取所有的NFT集合
    console.log(`get all collection`)
    const [frist,secned] = await NFTFactory.getCollections()
    console.log(frist)
    console.log(secned)
    // const nftCollections = await NFTFactory.getCollections()
    // nftCollections.forEach(function(element, index) {
    //         console.log("Index: " + index + ", Element: " + element); // 输出索引和元素
    //     });
    console.log(`create ${frist} mint nft`)
    // 用第一个集合创建NFT
    await NFTFactory.mintInCollection(frist,deployer.address)
    await NFTFactory.mintInCollection(frist,deployer.address)
    await NFTFactory.mintInCollection(frist,deployer.address)
    await NFTFactory.mintInCollection(frist,deployer.address)
    console.log(`done ${frist} nft mint `)

    //获取nft创建人在指定集合下 有多少个NFT
    const ERC721TemplateFacory = await ethers.getContractFactory("ERC721Template");
    const ERC721Template = ERC721TemplateFacory.attach(frist);
    const balances = await ERC721Template.balanceOf(deployer)
    console.log(`balances ${balances}`)
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    });


// npx hardhat run scripts/deploy_factory.js