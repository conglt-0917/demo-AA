import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { Create2Factory } from '../src/Create2Factory'
import { ethers } from 'hardhat'
import hre from 'hardhat'

const deployEntryPoint: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const provider = ethers.provider
  const from = await provider.getSigner().getAddress()
  await new Create2Factory(ethers.provider).deployFactory()

  const ret = await hre.deployments.deploy(
    'EntryPoint', {
      from,
      args: [],
      gasLimit: 6e6,
      deterministicDeployment: true
    })
  console.log('==entrypoint addr=', ret.address)

  const entryPointAddress = ret.address
  const w = await hre.deployments.deploy(
    'SimpleAccount', {
      from,
      args: [entryPointAddress],
      gasLimit: 2e6,
      deterministicDeployment: true
    })

  console.log('== wallet=', w.address)

  const t = await hre.deployments.deploy('TestCounter', {
    from,
    deterministicDeployment: true
  })
  console.log('==testCounter=', t.address)
}

const deploySimpleAccountFactory: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const provider = ethers.provider
    const from = await provider.getSigner().getAddress()
    const network = await provider.getNetwork()
    // only deploy on local test network.
    if (network.chainId !== 31337 && network.chainId !== 1337) {
      return
    }

    const entrypoint = await hre.deployments.get('EntryPoint')
    const ret = await hre.deployments.deploy(
      'SimpleAccountFactory', {
        from,
        args: [entrypoint.address],
        gasLimit: 6e6,
        log: true,
        deterministicDeployment: true
      })
    console.log('==SimpleAccountFactory addr=', ret.address)
  }

async function main() {
    await deployEntryPoint(hre);
    await deploySimpleAccountFactory(hre);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

