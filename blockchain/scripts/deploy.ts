import { ethers, run } from "hardhat"

//npx hardhat run scripts/deploy.js --network <network-name>

const deploy = async () => {
  try {
    const StepsHunter = await ethers.getContractFactory("StepsHunter")
    const stepsHunter = await StepsHunter.deploy(
      1,
      '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
      '0x40193c8518BB267228Fc409a613bDbD8eC5a97b3',
      // ethers.utils.formatBytes32String('ca98366cc7314957b8c012c72f05aeeb'),
      '0xDb8e8e2ccb5C033938736aa89Fe4fa1eDfD15a1d', // polygon
      //  '0x57A4a13b35d25EE78e084168aBaC5ad360252467', // mumbai
      '0x02777053d6764996e594c3E88AF1D58D5363a2e6', // polygon
      // '0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2'// mumbai
      'https://stepshunter.ngrok.app'
    )

    const stepsHunterDeployed = await stepsHunter.deployed()
    const stepsHunterAddress = stepsHunterDeployed.address
    console.log(`Steps Hunter contract was deployed to ${stepsHunterAddress}`)

    const stepHunterNftAddress = await stepsHunterDeployed.stepsHunterNft()

    console.log(`Steps Hunter Nft contract was deployed to ${stepHunterNftAddress}`)

    return { stepsHunterAddress, stepHunterNftAddress }
  } catch (error) {
    console.error(error)
    throw new Error('Verification failed')
  }
}

const verify = async (addresses: { stepsHunterAddress: string, stepHunterNftAddress: string }) => {
  try {
    await run("verify:verify", {
      address: addresses.stepsHunterAddress,
      constructorArguments: [
        1,
        '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
        '0x40193c8518BB267228Fc409a613bDbD8eC5a97b3',
        // ethers.utils.formatBytes32String('ca98366cc7314957b8c012c72f05aeeb'),
        '0xDb8e8e2ccb5C033938736aa89Fe4fa1eDfD15a1d', // polygon
        //  '0x57A4a13b35d25EE78e084168aBaC5ad360252467', // mumbai
        '0x02777053d6764996e594c3E88AF1D58D5363a2e6', // polygon
        // '0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2'// mumbai,
        'https://stepshunter.ngrok.app'
      ],
    })

    await run("verify:verify", {
      address: addresses.stepHunterNftAddress,
      constructorArguments: [],
    })
  } catch (error) {
    console.error(error)
    throw new Error('Verification failed')
  }
}

async function main() {
  const addresses = await deploy()

  await verify(addresses)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
