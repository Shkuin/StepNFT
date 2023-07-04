import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { random } from "lodash"

import { CreateReqEvent, CreateReqEventObject, GoalParamsStructOutput } from '../../blockchain/typechain-types/contracts/StepsHunter.sol/StepsHunter'
import { StepsHunter__factory, StepsHunter } from "../typechain-types"
import { StepsHunterInterface, GoalCreatedEvent, GoalCreatedEventObject } from "../typechain-types/contracts/StepsHunter.sol/StepsHunter"
import { BigNumber, ContractReceipt } from "ethers"

const linkTokenAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'

enum GoalStatus {
  PENDING = 0,
  ACTIVE = 1,
  PAUSE = 2,
  SUCCESS = 3,
  FAIL = 4,
  ERROR = 5
}

enum GoalDayRecordStatus {
  PENDING = 0,
  SUCCESS = 1,
  FAIL = 2
}

enum GoalDayRecordRequestStatus {
  PENDING = 0,
  REQUESTED = 1,
  FULFILLED = 2,
  PROCESSED = 3
}

const GoalStatusToNftAttributeStatusMap: Record<GoalStatus, string> = {
  [GoalStatus.PENDING]: 'Pending',
  [GoalStatus.ACTIVE]: 'Active',
  [GoalStatus.PAUSE]: 'Pause',
  [GoalStatus.SUCCESS]: 'Success',
  [GoalStatus.FAIL]: 'Fail',
  [GoalStatus.ERROR]: 'Error',
}

interface IGoal {
  goalCreateParams: GoalParamsStructOutput
  goalDayRecordsParams: {
    reqId: string
    stepsCount: number
    failDaysCount: number
    status: GoalDayRecordStatus
  }[]
  expectedState: {
    status: GoalStatus
    failDaysCount: number
    dayRecordsCount: number
  }
  state: {
    id: number | undefined
    failDaysCount: number
    status: GoalStatus
  }
}

const testGoal1: IGoal = {
  goalCreateParams: {
    durationDaysCount: ethers.BigNumber.from(7),
    betAmount: ethers.BigNumber.from(1).mul(ethers.constants.WeiPerEther),
    dailyStepsCount: ethers.BigNumber.from(5000),
    maxFailDaysCount: ethers.BigNumber.from(3),
  },
  state: {
    id: undefined,
    failDaysCount: 0,
    status: GoalStatus.ACTIVE
  },
  expectedState: {
    failDaysCount: 3,
    dayRecordsCount: 7,
    status: GoalStatus.SUCCESS,
  },
  goalDayRecordsParams: [
    { stepsCount: 3000, status: GoalDayRecordStatus.FAIL, failDaysCount: 1, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 6000, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 1, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 8000, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 1, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 7500, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 1, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 2000, status: GoalDayRecordStatus.FAIL, failDaysCount: 2, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 10000, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 2, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 100, status: GoalDayRecordStatus.FAIL, failDaysCount: 3, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) }
  ]
}

const testGoal2: IGoal = {
  goalCreateParams: {
    durationDaysCount:  ethers.BigNumber.from(8),
    betAmount: ethers.BigNumber.from(2).mul(ethers.constants.WeiPerEther),
    dailyStepsCount: ethers.BigNumber.from(5000),
    maxFailDaysCount: ethers.BigNumber.from(2),
  },
  state: {
    id: undefined,
    failDaysCount: 0,
    status: GoalStatus.ACTIVE
  },
  expectedState: {
    failDaysCount: 3,
    dayRecordsCount: 6,
    status: GoalStatus.FAIL,
  },
  goalDayRecordsParams: [
    { stepsCount: 2000, status: GoalDayRecordStatus.FAIL, failDaysCount: 1, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 3000, status: GoalDayRecordStatus.FAIL, failDaysCount: 2, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 5001, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 2, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 6500, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 2, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 5560, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 2, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 4000, status: GoalDayRecordStatus.FAIL, failDaysCount: 3, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    // { stepsCount: 4000, status: GoalDayRecordStatus.FAIL, failDaysCount: 1, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) } // Will not go through checkUpkeep. It is ok
  ]
}

const testGoal3: IGoal = {
  goalCreateParams: {
    durationDaysCount:  ethers.BigNumber.from(8),
    betAmount: ethers.BigNumber.from(2).mul(ethers.constants.WeiPerEther),
    dailyStepsCount: ethers.BigNumber.from(5000),
    maxFailDaysCount: ethers.BigNumber.from(2),
  },
  state: {
    id: undefined,
    failDaysCount: 0,
    status: GoalStatus.ACTIVE
  },
  expectedState: {
    failDaysCount: 3,
    dayRecordsCount: 5,
    status: GoalStatus.FAIL,
  },
  goalDayRecordsParams: [
    { stepsCount: 2000, status: GoalDayRecordStatus.FAIL, failDaysCount: 1, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 3000, status: GoalDayRecordStatus.FAIL, failDaysCount: 2, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 5001, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 2, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 6500, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 2, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 4000, status: GoalDayRecordStatus.FAIL, failDaysCount: 3, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    { stepsCount: 5560, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 3, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    // { stepsCount: 4000, status: GoalDayRecordStatus.FAIL, failDaysCount: 1, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) } // Will not go through checkUpkeep. It is ok
  ]
}

const testGoal4: IGoal = {
  goalCreateParams: {
    durationDaysCount:  ethers.BigNumber.from(1),
    betAmount: ethers.BigNumber.from(2).mul(ethers.constants.WeiPerEther),
    dailyStepsCount: ethers.BigNumber.from(3000),
    maxFailDaysCount: ethers.BigNumber.from(1),
  },
  state: {
    id: undefined,
    failDaysCount: 0,
    status: GoalStatus.ACTIVE
  },
  expectedState: {
    failDaysCount: 1,
    dayRecordsCount: 1,
    status: GoalStatus.SUCCESS,
  },
  goalDayRecordsParams: [
    { stepsCount: 2990, status: GoalDayRecordStatus.FAIL, failDaysCount: 1, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    // { stepsCount: 3000, status: GoalDayRecordStatus.FAIL, failDaysCount: 2, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    // { stepsCount: 5001, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 2, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    // { stepsCount: 6500, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 2, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    // { stepsCount: 4000, status: GoalDayRecordStatus.FAIL, failDaysCount: 3, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    // { stepsCount: 5560, status: GoalDayRecordStatus.SUCCESS, failDaysCount: 3, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) },
    // { stepsCount: 4000, status: GoalDayRecordStatus.FAIL, failDaysCount: 1, reqId: ethers.utils.formatBytes32String(random(1, 1000000).toString()) } // Will not go through checkUpkeep. It is ok
  ]
}


const testGoals = [testGoal1]
// const testGoals = [testGoal3, testGoal4]

enum GoalNftMetadataAttributeId {
  'status_trait',
  'duration_days_count_trait',
  'day_records_count_trait',
  'max_fail_days_count_trait',
  'fail_days_count_trait',
  'daily_steps_count_trait',
  'bet_amount_trait'
}

const GoalNftMetadataAttributeIndexIdMap: Record<number, GoalNftMetadataAttributeId> = {
  0: GoalNftMetadataAttributeId.status_trait,
  1: GoalNftMetadataAttributeId.duration_days_count_trait,
  2: GoalNftMetadataAttributeId.day_records_count_trait,
  3: GoalNftMetadataAttributeId.max_fail_days_count_trait,
  4: GoalNftMetadataAttributeId.fail_days_count_trait,
  5: GoalNftMetadataAttributeId.daily_steps_count_trait,
  6: GoalNftMetadataAttributeId.bet_amount_trait
}
interface GoalNftMetadataAttribute {
  display_type: string,
  trait_type: string,
  trait_type_id?: GoalNftMetadataAttributeId
  value: string
}

interface GoalNftMetadata {
  name: string
  description: string
  image: string
  attributes: GoalNftMetadataAttribute[]
}

const minChainlinkAutomationUpkeepFundBalance = ethers.BigNumber.from('5000000000000000000') // 5 Ether

const getCreateGoalLinkAmountRequired = (_goalParams: GoalParamsStructOutput) => {
  const stepsHunterGoalFee = ethers.BigNumber.from(1).mul(ethers.constants.WeiPerEther) // 1 Ether
  const chainlinkApiRequestCostAmount = ethers.BigNumber.from('100000000000000000') // 0.1 Ether
  const chainlinkAutomationUpkeepPerformCostAmount = ethers.BigNumber.from('100000000000000000') // 0.1 Ether
  const goalChainlinkInfrastructureCost = chainlinkApiRequestCostAmount.mul(_goalParams.durationDaysCount).add(chainlinkAutomationUpkeepPerformCostAmount.mul(_goalParams.durationDaysCount).mul(2))
  const totalGoalPayment = stepsHunterGoalFee.add(goalChainlinkInfrastructureCost).add(_goalParams.betAmount)

  return totalGoalPayment
}

const getGoalIdFromCreateGoalTxReceipt = (receipt: ContractReceipt, stepsHunterContract: StepsHunter) => {
  const event = receipt.events?.find((event) => event?.eventSignature === "GoalCreated(uint256,uint256)")
  if (!event) return undefined

  const parsedEvent = stepsHunterContract.interface.parseLog(event)
  const args: GoalCreatedEventObject = parsedEvent.args as any as GoalCreatedEventObject

  if (!args.goalId) return undefined

  return args.goalId.toNumber()
}

const getReqIdFromRequestGoalDayRecordTxReceipt = (receipt: ContractReceipt, stepsHunterContract: StepsHunter) => {
  const event = receipt.events?.find((event) => event?.eventSignature === "CreateReq(bytes32)")
  if (!event) return undefined

  const parsedEvent = stepsHunterContract.interface.parseLog(event)
  const args: CreateReqEventObject = parsedEvent.args as any as CreateReqEventObject

  if (!args._requestId) return undefined

  return args._requestId;
}


const getGoalNftMetadata = async (goalId: number, stepsHunterContract: StepsHunter) => {
  try {
    const stepsHunterNftContractAddress = await stepsHunterContract.stepsHunterNft()

    const StepsHunterNftFactory = await ethers.getContractFactory("StepsHunterNft")
    const stepsHunterNftContract = await StepsHunterNftFactory.attach(stepsHunterNftContractAddress)

    const goalNftURI = await stepsHunterNftContract.tokenURI(goalId)

    const goalNftMetadataBase64Encoded = goalNftURI?.split(',')[1] || undefined
    if (!goalNftMetadataBase64Encoded) return undefined

    const goalNftMetadataDecoded: GoalNftMetadata = JSON.parse(atob(goalNftMetadataBase64Encoded))
    if (!goalNftMetadataDecoded) return undefined

    const goalNftImageSvgBase64Encoded = goalNftMetadataDecoded?.image?.split(',')[1] || undefined
    if (!goalNftImageSvgBase64Encoded) return undefined
    const goalNftImageSvgDecoded = atob(goalNftImageSvgBase64Encoded)

    const goalNftMetadata: GoalNftMetadata = {
      name: goalNftMetadataDecoded.name,
      description: goalNftMetadataDecoded.description,
      image: goalNftImageSvgDecoded,
      attributes: goalNftMetadataDecoded.attributes.map((attribute, i) => ({
        display_type: attribute.display_type,
        trait_type: attribute.trait_type,
        trait_type_id: GoalNftMetadataAttributeIndexIdMap[i],
        value: attribute.value
      }))
    }

    return goalNftMetadata

  } catch (error) {
    console.error(error)

    return undefined
  }
}

let stepsHunterContractAddress: string | undefined = undefined

describe("StepsHunter", function () {
  // async function deployStepsHunterFixture() {
  //   const [owner] = await ethers.getSigners()

  //   const StepsHunterContractFactory = await ethers.getContractFactory("StepsHunter")
  //   const stepsHunterContract = await StepsHunterContractFactory.deploy(0)

  //   await stepsHunterContract.deployed()

  //   return { owner, stepsHunterContract }
  // }
  
  async function deployStepsHunterContract() {
    const StepsHunterContractFactory = await ethers.getContractFactory("StepsHunter")
    const stepsHunterContract = await StepsHunterContractFactory.deploy(
      0,
      '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
      '0x40193c8518BB267228Fc409a613bDbD8eC5a97b3',
      // ethers.utils.formatBytes32String('ca98366cc7314957b8c012c72f05aeeb'),
      '0xDb8e8e2ccb5C033938736aa89Fe4fa1eDfD15a1d', // polygon
      //  '0x57A4a13b35d25EE78e084168aBaC5ad360252467', // mumbai
      '0x02777053d6764996e594c3E88AF1D58D5363a2e6', // polygon
      // '0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2'// mumbai
      'https://a87b-1-46-24-80.ngrok-free.app'
    )

    stepsHunterContractAddress = stepsHunterContract.address

    await stepsHunterContract.deployed()
  }

  async function getStepsHunterContract() {
    if (!stepsHunterContractAddress) throw new Error('Contract is not deployed')

    const StepsHunterFactory = await ethers.getContractFactory("StepsHunter")
    const stepsHunterContract = await StepsHunterFactory.attach(stepsHunterContractAddress)

    return stepsHunterContract
  }

  it("Should deploy StepsHunter contract with correct env", async function () {
    await deployStepsHunterContract()
    const stepsHunterContract = await getStepsHunterContract()

    // console.log('env', await stepsHunterContract.env())
    expect(await stepsHunterContract.env()).to.equal(0)
  })

  it("Should Steps Hunter contract be funded with Link tokens for chainlink infrastructure service", async function () {
    const [owner] = await ethers.getSigners()
    const stepsHunterContract = await getStepsHunterContract()

    const ERC20TokenFactory = await ethers.getContractFactory("ERC20Token")
    const linkTokenContract = await ERC20TokenFactory.attach(linkTokenAddress)

    const transferLinkTokenTx = await linkTokenContract.transfer(stepsHunterContract.address, minChainlinkAutomationUpkeepFundBalance.mul(2))
    const transferLinkTokenTxReceipt = await transferLinkTokenTx.wait(0)

    const stepsHunterContactLinkBalance = await linkTokenContract.balanceOf(stepsHunterContract.address)

    expect(stepsHunterContactLinkBalance).to.greaterThanOrEqual(minChainlinkAutomationUpkeepFundBalance.mul(2))
  })

  testGoals.forEach(async(testGoal, i) => {
    describe(`Test of goal #${i+ 1}`, function () {

      it("Should correctly allow the required amount of link tokens to StepsHunter", async function () {
        const [owner] = await ethers.getSigners()
        const stepsHunterContract = await getStepsHunterContract()

        const ERC20TokenFactory = await ethers.getContractFactory("ERC20Token")
        const linkTokenContract = await ERC20TokenFactory.attach(linkTokenAddress)

        const createGoalLinkAmountRequired = getCreateGoalLinkAmountRequired(testGoal.goalCreateParams)

        console.log('createGoalLinkAmountRequired', createGoalLinkAmountRequired)

        const linkApproveTx = await linkTokenContract.approve(stepsHunterContract.address, createGoalLinkAmountRequired)
        const linkApproveTxReceipt = await linkApproveTx.wait(0)

        const stepsHunterContactUserAllowance = await linkTokenContract.allowance(owner.address, stepsHunterContract.address)

        expect(stepsHunterContactUserAllowance).to.greaterThanOrEqual(createGoalLinkAmountRequired)
      })

      // it("Should correctly fund the StepsHunter with link", async function () {
      //   const [owner] = await ethers.getSigners()
      //   const stepsHunterContract = await getStepsHunterContract()

      //   const ERC20TokenFactory = await ethers.getContractFactory("ERC20Token")
      //   const linkTokenContract = await ERC20TokenFactory.attach(linkTokenAddress)

      //   const linkTransfer = await linkTokenContract.transfer(stepsHunterContract.address, ethers.BigNumber.from('5000000000000000000'))
      //   const linkTransferReceipt = await linkTransfer.wait(0)

      //   const stepsHunterContractLinkBalance = await linkTokenContract.balanceOf(stepsHunterContract.address)

      //   expect(stepsHunterContractLinkBalance).to.greaterThanOrEqual(ethers.BigNumber.from('5000000000000000000'))
      // })

      it("Should correctly create the Goal", async function () {
        const [owner] = await ethers.getSigners()
        const stepsHunterContract = await getStepsHunterContract()

        const createGoalTx = await stepsHunterContract.createGoal({
          ...testGoal.goalCreateParams
        }, {
          gasLimit: 10_000_000,
        })

        const createGoalTxReceipt = await createGoalTx.wait(0)

        const goalId = getGoalIdFromCreateGoalTxReceipt(createGoalTxReceipt, stepsHunterContract)

        testGoal.state.id = goalId
        if (!testGoal.state.id) throw new Error('Goal is not created')

        const createdGoal = await stepsHunterContract.goalsMap(testGoal.state.id)

        expect(goalId).to.be.not.undefined
        expect(createdGoal.id).to.equal(testGoal.state.id)
      })

      it("Should get the correct NFT for a Goal", async function () {
        if (!testGoal.state.id) throw new Error('Goal is not created')

        const [owner] = await ethers.getSigners()
        const stepsHunterContract = await getStepsHunterContract()

        const createdGoal = await stepsHunterContract.goalsMap(testGoal.state.id)
        const goalNftMetadata = await getGoalNftMetadata(testGoal.state.id, stepsHunterContract)
        console.log('Goal Nft Metadata', goalNftMetadata)
        console.log('Goal State', createdGoal)

        expect(goalNftMetadata?.attributes.find(attr => attr.trait_type_id === GoalNftMetadataAttributeId.status_trait)?.value).to.equal('Active')
        expect(goalNftMetadata?.attributes.find(attr => attr.trait_type_id === GoalNftMetadataAttributeId.duration_days_count_trait)?.value).to.equal(createdGoal.durationDaysCount.toString())
        expect(goalNftMetadata?.attributes.find(attr => attr.trait_type_id === GoalNftMetadataAttributeId.day_records_count_trait)?.value).to.equal(createdGoal.dayRecordsCount.toString())
        expect(goalNftMetadata?.attributes.find(attr => attr.trait_type_id === GoalNftMetadataAttributeId.max_fail_days_count_trait)?.value).to.equal(createdGoal.maxFailDaysCount.toString())
        expect(goalNftMetadata?.attributes.find(attr => attr.trait_type_id === GoalNftMetadataAttributeId.fail_days_count_trait)?.value).to.equal(createdGoal.failDaysCount.toString())
        expect(goalNftMetadata?.attributes.find(attr => attr.trait_type_id === GoalNftMetadataAttributeId.daily_steps_count_trait)?.value).to.equal(createdGoal.dailyStepsCount.toString())
        expect(goalNftMetadata?.attributes.find(attr => attr.trait_type_id === GoalNftMetadataAttributeId.bet_amount_trait)?.value).to.equal(createdGoal.betAmount.toString())
      })

      testGoal.goalDayRecordsParams.forEach((dayRecordParam, i) => {
        it(`Should correctly add goal day record #${i+1}`, async function () {
          const [owner] = await ethers.getSigners()
          const stepsHunterContract = await getStepsHunterContract()

          if (!testGoal.state.id) throw new Error('Goal is not created')
          const dayRecordIndex = i + 1

          // Request
          const checkUpkeepResultForRequest = await stepsHunterContract.checkUpkeep(ethers.utils.defaultAbiCoder.encode(["uint256"], [ testGoal.state.id]))
          console.log(`checkUpkeepResultForRequest at day #${i+1}`, checkUpkeepResultForRequest)
          expect(checkUpkeepResultForRequest.upkeepNeeded).to.equal(true)

          const requestGoalDayRecordTx = await stepsHunterContract.requestGoalDayRecord(testGoal.state.id, { gasLimit: 10_000_000 })
          const requestGoalDayRecordTxReceipt = await requestGoalDayRecordTx.wait(0)

          const dayRecordReqId = await getReqIdFromRequestGoalDayRecordTxReceipt(requestGoalDayRecordTxReceipt, stepsHunterContract)
          if (!dayRecordReqId) throw new Error('dayRecordReqId is not defined')

          const goalDayRecordReqAfterRequest = await stepsHunterContract.goalsDaysRecordsReqsMap(dayRecordReqId)
          expect(goalDayRecordReqAfterRequest.requestId ).to.equal(dayRecordReqId)
          expect(goalDayRecordReqAfterRequest.requestStatus ).to.equal(GoalDayRecordRequestStatus.REQUESTED)

          // Fullfil
          const addRecordTx = await stepsHunterContract._fulfill(dayRecordReqId, dayRecordParam.stepsCount, { gasLimit: 10_000_000 })
          await addRecordTx.wait(0)
          const goalDayRecordReqAfterFullfill = await stepsHunterContract.goalsDaysRecordsReqsMap(dayRecordReqId)
          expect(goalDayRecordReqAfterFullfill.requestId ).to.equal(dayRecordReqId)
          expect(goalDayRecordReqAfterFullfill.requestStatus ).to.equal(GoalDayRecordRequestStatus.FULFILLED)
          expect(goalDayRecordReqAfterFullfill.stepsCount ).to.equal(dayRecordParam.stepsCount)

          // Process
          const checkUpkeepResultForProcess = await stepsHunterContract.checkUpkeep(ethers.utils.defaultAbiCoder.encode(["uint256"], [ testGoal.state.id]))
          console.log(`checkUpkeepResultForProcess at day #${i+1}`, checkUpkeepResultForProcess)
          expect(checkUpkeepResultForProcess.upkeepNeeded ).to.equal(true)

          const processGoalDayRecordTx = await stepsHunterContract.processGoalDayRecord(
            testGoal.state.id,
            dayRecordReqId,
            dayRecordParam.stepsCount
          )
          await processGoalDayRecordTx.wait(0)

          const goalDayRecordReqAfterProcess = await stepsHunterContract.goalsDaysRecordsReqsMap(dayRecordReqId)
          expect(goalDayRecordReqAfterProcess.requestId ).to.equal(dayRecordReqId)
          expect(goalDayRecordReqAfterProcess.requestStatus ).to.equal(GoalDayRecordRequestStatus.PROCESSED)

          const goalDayRecordAfterProcess = await stepsHunterContract.goalsDayRecordsMap(testGoal.state.id, dayRecordIndex)
          expect(goalDayRecordAfterProcess.status).to.equal(dayRecordParam.status)
          expect(goalDayRecordAfterProcess.stepsCount).to.equal(dayRecordParam.stepsCount)

          const goal = await stepsHunterContract.goalsMap(testGoal.state.id)
          expect(goal.currentDayRecordRequestId).to.equal(ethers.constants.Zero)
          expect(goal.failDaysCount).to.equal(dayRecordParam.failDaysCount)

          const goalNftMetadata = await getGoalNftMetadata(testGoal.state.id, stepsHunterContract)

          console.log(`Goal Nft Metadata at day #${i+1}`, goalNftMetadata)
          console.log(`Goal State at day #${i+1}`, goal)

          expect(goalNftMetadata?.attributes.find(attr => attr.trait_type_id === GoalNftMetadataAttributeId.day_records_count_trait)?.value).to.equal(dayRecordIndex.toString())
          expect(goalNftMetadata?.attributes.find(attr => attr.trait_type_id === GoalNftMetadataAttributeId.fail_days_count_trait)?.value).to.equal(goal.failDaysCount.toString())
        })
      })

      it("Should finish the Goal with correct status", async function () {
        const [owner] = await ethers.getSigners()
        const stepsHunterContract = await getStepsHunterContract()

        if (!testGoal.state.id) throw new Error('Goal is not created')

        const goal = await stepsHunterContract.goalsMap(testGoal.state.id)
        expect(goal.status).to.equal(testGoal.expectedState.status)
        expect(goal.dayRecordsCount.toNumber()).to.equal(testGoal.expectedState.dayRecordsCount)
        expect(goal.failDaysCount.toNumber()).to.equal(testGoal.expectedState.failDaysCount)

        const goalNftMetadata = await getGoalNftMetadata(testGoal.state.id, stepsHunterContract)

        expect(goalNftMetadata).to.be.not.undefined
        expect(goalNftMetadata?.attributes.find(attr => attr.trait_type_id === GoalNftMetadataAttributeId.status_trait)?.value).to.equal(GoalStatusToNftAttributeStatusMap[testGoal.expectedState.status])
        expect(goalNftMetadata?.attributes.find(attr => attr.trait_type_id === GoalNftMetadataAttributeId.fail_days_count_trait)?.value).to.equal(testGoal.expectedState.failDaysCount.toString())
      })
    })
  })
})
