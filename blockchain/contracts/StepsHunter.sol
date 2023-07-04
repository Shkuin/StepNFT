// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import { LinkTokenInterface } from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import { AutomationRegistryInterface, State, Config } from "@chainlink/contracts/src/v0.8/interfaces/AutomationRegistryInterface1_2.sol";
import '@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol';
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';
import '@chainlink/contracts/src/v0.8/Chainlink.sol';
import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import '@chainlink/contracts/src/v0.8/vendor/CBORChainlink.sol';
import '@chainlink/contracts/src/v0.8/vendor/BufferChainlink.sol';
import '@chainlink/contracts/src/v0.8/vendor/ENSResolver.sol';
import '@chainlink/contracts/src/v0.8/interfaces/ENSInterface.sol';
import '@chainlink/contracts/src/v0.8/interfaces/ChainlinkRequestInterface.sol';
import '@chainlink/contracts/src/v0.8/interfaces/OperatorInterface.sol';
import '@chainlink/contracts/src/v0.8/interfaces/PointerInterface.sol';
import '@chainlink/contracts/src/v0.8/interfaces/PointerInterface.sol';

import "./StepsHunterNft.sol";

enum ENV { LOCALNET, TESTNET, MAINNET }

interface KeeperRegistrarInterface {
    function register(
        string memory name,
        bytes calldata encryptedEmail,
        address upkeepContract,
        uint32 gasLimit,
        address adminAddress,
        bytes calldata checkData,
        uint96 amount,
        uint8 source,
        address sender
    ) external;
}

enum GoalDayRecordStatus { PENDING, SUCCESS, FAIL }
enum GoalDayRecordRequestStatus { PENDING, REQUESTED, FULFILLED, PROCESSED }
enum GoalStatus { PENDING, ACTIVE, PAUSE, SUCCESS, FAIL, ERROR }

struct GoalDayRecord {
	uint id; // day index
    bytes32 requestId;
	uint dateTimestamp; // day date
	uint goalId; // ref to Goal
	uint stepsCount;
	GoalDayRecordStatus status;
}

struct GoalDayRecordReq {
    bytes32 requestId; // chainlink id
	uint goalId; // ref to Goal
	uint dateTimestamp; // request date
	uint stepsCount; // request response
    GoalDayRecordRequestStatus requestStatus;
}

struct Goal {
    // uint startDateTimestamp;
    // uint endDateTimestamp;
    uint id;
    GoalStatus status;
    uint durationDaysCount; // in days
    uint dayRecordsCount;
    // bool hasPendingRecordRequestFulfillment;
    // bool hasPendingRecordRequestProcession;
    bytes32 currentDayRecordRequestId;
    uint lastDayRecordTimestamp;
    // uint timeZoneOffset;
    uint maxFailDaysCount;
    uint failDaysCount;
    uint dailyStepsCount;
    uint betAmount;
    address userAddr;
    uint256 upkeepID;
}

struct GoalParams {
    uint durationDaysCount; // in days
    // uint startDateTimestamp;
    // uint endDateTimestamp;
    // uint timeZoneOffset;
    uint maxFailDaysCount;
    uint dailyStepsCount;
    uint betAmount;
}

contract StepsHunter is ChainlinkClient, ConfirmedOwner, AutomationCompatibleInterface {
    using Chainlink for Chainlink.Request;
    using Counters for Counters.Counter;

    ENV public immutable env;
    
    StepsHunterNft public immutable stepsHunterNft;

    uint constant chainlinkApiRequestCostAmount = 100000000000000000; // 0.1 Ether
    uint constant chainlinkAutomationUpkeepPerformCostAmount = 100000000000000000; // 0.1 Ether
    uint constant minChainlinkAutomationUpkeepFundBalance = 5 ether; // 1 Ether;
    uint constant stepsHunterGoalFee = 1 ether; // 1 Ether
    string stepsHunterBackendHost;

    bytes32 immutable jobId;
    uint immutable fee;

    uint public immutable goalCheckInterval;
    uint public lastTimeStamp;

    LinkTokenInterface public immutable i_link;
    address public immutable registrar;
    AutomationRegistryInterface public immutable i_registry;
    bytes4 registerSig = KeeperRegistrarInterface.register.selector;

    // KeeperRegistrarInterface public immutable i_registrar;

    address lostBetRecipientAddr;

    Counters.Counter private _goalIds;

    event GoalCreated(uint indexed goalId, uint indexed goalUpkeepID);
    event GoalFinished(uint indexed goalId, GoalStatus indexed status);
    event GoalDayRecordAdded(uint indexed goalId, uint indexed goalDayRecordId, uint stepsCount);
    event CreateReq(bytes32 indexed _requestId);
    event FulfillRes(bytes32 indexed _requestId, uint _stepsCount);

    constructor(
            ENV _env,
            address chainlinkTokenAddress, //0x326C977E6efc84E512bB9C30f76E30c160eD06FB Polygon Mumbai Link from https://docs.chain.link/docs/link-token-contracts/#mumbai-testnet
            address chainlinkOracleAddress, // 0x40193c8518BB267228Fc409a613bDbD8eC5a97b3 Polygon Mumbai oracle from https://docs.chain.link/docs/any-api/testnet-oracles/#operator-contracts
            // bytes32 chainlinkOracleRequestJobId, // ca98366cc7314957b8c012c72f05aeeb  Polygon Mumbai job id from https://docs.chain.link/docs/any-api/testnet-oracles/#job-ids
            address chainlinkRegistrarAddress, // 0x57A4a13b35d25EE78e084168aBaC5ad360252467 Polygon Mumbai from https://docs.chain.link/chainlink-automation/supported-networks/#configurations
            address chainlinkRegistryAddress, // 0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2 // Polygon Mumbai from https://docs.chain.link/chainlink-automation/supported-networks/#configurations
            string memory _stepsHunterBackendHost
        ) ConfirmedOwner(msg.sender) {
        env = _env;
        // stepsHunterNft = _stepsHunterNft;
        stepsHunterNft = new StepsHunterNft();

        setChainlinkToken(chainlinkTokenAddress);
        setChainlinkOracle(chainlinkOracleAddress);
        jobId = 'ca98366cc7314957b8c012c72f05aeeb'; // chainlinkOracleRequestJobId; //
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)

        i_link = LinkTokenInterface(chainlinkTokenAddress);

        registrar = chainlinkRegistrarAddress; //
        i_registry = AutomationRegistryInterface(chainlinkRegistryAddress); 

        stepsHunterBackendHost = _stepsHunterBackendHost;

        // i_registrar = KeeperRegistrarInterface(0x57A4a13b35d25EE78e084168aBaC5ad360252467);

        lostBetRecipientAddr = 0x46E40347CE742Bc0ab8c515025b6C81752220C6F; // 0x46E40347CE742Bc0ab8c515025b6C81752220C6F;

        goalCheckInterval = 10 seconds;
        lastTimeStamp = block.timestamp;
    }

    mapping (uint => Goal) public goalsMap;
    mapping (uint => mapping (uint => GoalDayRecord)) public goalsDayRecordsMap; // [goalId][goalDayRecordIndex]: GoalDayRecord
    mapping (bytes32 => GoalDayRecordReq) public goalsDaysRecordsReqsMap; // [goalDayRecordReqId]: GoalDayRecordReq

    function _registerAndPredictID(
        string memory name,
        bytes memory encryptedEmail,
        address upkeepContract,
        uint32 gasLimit,
        address adminAddress,
        bytes memory checkData,
        uint amount,
        uint8 source
    ) internal returns (uint256 upkeepID) {
        (State memory state, Config memory _c, address[] memory _k) = i_registry
            .getState();
        uint256 oldNonce = state.nonce;
        bytes memory payload = abi.encode(
            name,
            encryptedEmail,
            upkeepContract,
            gasLimit,
            adminAddress,
            checkData,
            amount,
            source,
            address(this)
        );

        i_link.transferAndCall(
            registrar,
            amount,
            bytes.concat(registerSig, payload)
        );
        (state, _c, _k) = i_registry.getState();
        uint256 newNonce = state.nonce;
        if (newNonce == oldNonce + 1) {
            return uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        address(i_registry),
                        uint32(oldNonce)
                    )
                )
            );
        } else {
            revert("auto-approve disabled");
        }
    }

    // function registerAndPredictID(RegistrationParams memory params) internal returns (uint256) {
    //     // LINK must be approved for transfer - this can be done every time or once
    //     // with an infinite approval
    //     i_link.approve(address(i_registrar), params.amount);
    //     uint256 upkeepID = i_registrar.registerUpkeep(params);
    //     if (upkeepID != 0) {
    //         return upkeepID;
    //         // DEV - Use the upkeepID however you see fit
    //     } else {
    //         revert("auto-approve disabled");
    //     }
    // }

    function computeGoalChainlinkInfrastructureCost(uint durationDaysCount) internal pure returns(uint) {        
        return (chainlinkApiRequestCostAmount * durationDaysCount) + (chainlinkAutomationUpkeepPerformCostAmount * durationDaysCount * 2);
    }

    function createGoal(
        GoalParams memory goalParams
    ) public payable {
        _goalIds.increment();
       uint newGoalId = _goalIds.current();

        Goal storage goal = goalsMap[newGoalId];
        require(goal.id != newGoalId, 'goal is already created');

        goal.id = newGoalId;
        goal.status = GoalStatus.ACTIVE;
        goal.durationDaysCount = goalParams.durationDaysCount;
        goal.dayRecordsCount = 0;
        goal.lastDayRecordTimestamp = 0;
        goal.maxFailDaysCount = goalParams.maxFailDaysCount;
        goal.failDaysCount = 0;
        goal.dailyStepsCount = goalParams.dailyStepsCount;
        goal.betAmount = goalParams.betAmount;
        goal.userAddr = msg.sender;
        //goal.startDateTimestamp = goalParams.startDateTimestamp;
        //goal.endDateTimestamp = goalParams.endDateTimestamp;
        //goal.timeZoneOffset = 0;

        require(i_link.balanceOf(address(this)) >= minChainlinkAutomationUpkeepFundBalance, 'Steps Hunter is unavailable. No enough LINK on contract');

        uint goalChainlinkInfrastructureCost = computeGoalChainlinkInfrastructureCost(goal.durationDaysCount);
        uint totalGoalPayment = stepsHunterGoalFee + goalChainlinkInfrastructureCost + goal.betAmount;

        require(i_link.balanceOf(msg.sender) >= totalGoalPayment, 'not enough balance');

        uint stepsHunterUserWalletAllowance = i_link.allowance(msg.sender, address(this));

        require(stepsHunterUserWalletAllowance >= totalGoalPayment, 'not enough allowance for contracts on user wallet');
        
        bool isTransferred = i_link.transferFrom(address(msg.sender), address(this), totalGoalPayment);
        require(isTransferred, "Failed to transfer from user balance");

        uint256 upkeepID = 0;

        // RegistrationParams memory params = RegistrationParams({
        //     name: string(abi.encodePacked('goal#', Strings.toString(newGoalId))),
        //     encryptedEmail: abi.encode(0),
        //     upkeepContract: address(this),
        //     gasLimit: 3000000,
        //     adminAddress: 0x46E40347CE742Bc0ab8c515025b6C81752220C6F, //must be contract owner
        //     checkData: abi.encode(newGoalId),
        //     offchainConfig: abi.encode(0),
        //     amount: 30000000000000000
        // });

        // upkeepID = registerAndPredictID(params);

        upkeepID = _registerAndPredictID(
            string(abi.encodePacked('goal#', Strings.toString(newGoalId))),
            abi.encode(0),
            address(this),
            2000000, //1000000,
            0x46E40347CE742Bc0ab8c515025b6C81752220C6F, //must be contract owner
            abi.encode(newGoalId),
            minChainlinkAutomationUpkeepFundBalance,
            0
        );

        goal.upkeepID = upkeepID;

        NftMetadataCreateParams memory nftMetadata = NftMetadataCreateParams({
            status: GoalStatus.ACTIVE,
            durationDaysCount: goalParams.durationDaysCount,
            dayRecordsCount: 0,
            maxFailDaysCount: goalParams.maxFailDaysCount,
            failDaysCount: 0,
            dailyStepsCount: goalParams.dailyStepsCount,
            betAmount: goalParams.betAmount
        });

        stepsHunterNft.mintNft(msg.sender, newGoalId, nftMetadata);

        emit GoalCreated(goal.id, goal.upkeepID);
    }

    function processGoalDayRecord(
        uint goalId,
        bytes32 requestId,
        uint stepsCount
    ) public {
        Goal storage goal = goalsMap[goalId];
        require(goal.id == goalId, 'goal is not exist');

        // goal.hasPendingRecordRequestFulfillment = false;

        uint nextDayRecordId = goal.dayRecordsCount + 1;

        GoalDayRecord storage goalDayRecord = goalsDayRecordsMap[goalId][nextDayRecordId];
        require(goalDayRecord.id != nextDayRecordId, 'goal day record is already exist');

        GoalDayRecordReq storage goalDayRecordReq = goalsDaysRecordsReqsMap[requestId];
        require(goalDayRecordReq.requestId == requestId, 'goal day record req is not exist');

        goalDayRecord.id = nextDayRecordId;
        goalDayRecord.goalId = goalId;
        goalDayRecord.stepsCount = stepsCount;
        goalDayRecord.dateTimestamp = goalDayRecordReq.dateTimestamp;

        goal.dayRecordsCount = goal.dayRecordsCount + 1;
        goal.lastDayRecordTimestamp = goalDayRecord.dateTimestamp;

        goal.currentDayRecordRequestId = bytes32(0);
        goalDayRecordReq.requestStatus  = GoalDayRecordRequestStatus.PROCESSED;

        if (goalDayRecord.stepsCount >= goal.dailyStepsCount) {
            goalDayRecord.status = GoalDayRecordStatus.SUCCESS;
        } else {
            goalDayRecord.status = GoalDayRecordStatus.FAIL;
            goal.failDaysCount = goal.failDaysCount + 1;
        }

        NftMetadataCreateParams memory nftMetadata = NftMetadataCreateParams({
            status: goal.status,
            durationDaysCount: goal.durationDaysCount,
            dayRecordsCount: goal.dayRecordsCount,
            maxFailDaysCount: goal.maxFailDaysCount,
            failDaysCount: goal.failDaysCount,
            dailyStepsCount: goal.dailyStepsCount,
            betAmount: goal.betAmount
        });

        emit GoalDayRecordAdded(goalId, nextDayRecordId, goalDayRecord.stepsCount);

        if (goal.failDaysCount > goal.maxFailDaysCount) {
            goal.status = GoalStatus.FAIL;
            emit GoalFinished(goalId, goal.status);

            nftMetadata.status = GoalStatus.FAIL;
            stepsHunterNft.updateNft(goalId, nftMetadata);

            try i_link.transfer(lostBetRecipientAddr, goal.betAmount) {
                return;
            } catch {
                revert("Failed to transfer Goal bet to lost bet recipient user");
            }
        }

        if (goal.dayRecordsCount == goal.durationDaysCount && goal.failDaysCount <= goal.maxFailDaysCount) {
            goal.status = GoalStatus.SUCCESS;
            emit GoalFinished(goalId, goal.status);

            nftMetadata.status = GoalStatus.SUCCESS;
            stepsHunterNft.updateNft(goalId, nftMetadata);

            try i_link.transfer(address(goal.userAddr), goal.betAmount) {
                return;
            } catch {
                revert("Failed to transfer Goal bet back to user");
            }
        }

        if (goal.dayRecordsCount == goal.durationDaysCount && goal.failDaysCount > goal.maxFailDaysCount) {
            goal.status = GoalStatus.FAIL;
            emit GoalFinished(goalId, goal.status);

            nftMetadata.status = GoalStatus.FAIL;
            stepsHunterNft.updateNft(goalId, nftMetadata);

            try i_link.transfer(lostBetRecipientAddr, goal.betAmount) {
                return;
            } catch {
                revert("Failed to transfer Goal bet to lost bet recipient user");
            }
        }

        if (goal.dayRecordsCount <= goal.durationDaysCount) {
            stepsHunterNft.updateNft(goalId, nftMetadata);

            return;
        }

        // Somethink went wrong
        goal.status = GoalStatus.ERROR;
        emit GoalFinished(goalId, goal.status);

        nftMetadata.status = GoalStatus.ERROR;
        stepsHunterNft.updateNft(goalId, nftMetadata);

        return;
    }

    function checkUpkeep(
        bytes calldata checkData
    ) external view override returns (bool upkeepNeeded, bytes memory performData) {
        (uint goalId) = abi.decode(checkData, (uint));

        Goal storage goal = goalsMap[goalId];
        require(goal.id == goalId, 'goal is not exist');

        GoalDayRecordReq storage goalCurrentDayRecordReq = goalsDaysRecordsReqsMap[goal.currentDayRecordRequestId];

        bool isNextGoalCheckInterval = env != ENV.LOCALNET
            ? ((block.timestamp - goal.lastDayRecordTimestamp) > goalCheckInterval)
            : true
        ;

        bool upkeepNeededInCheckup = 
            (isNextGoalCheckInterval) &&
            (goal.dayRecordsCount < goal.durationDaysCount) &&
            (goal.status == GoalStatus.ACTIVE) &&
            (
                (goalCurrentDayRecordReq.requestId == bytes32(0) && goalCurrentDayRecordReq.requestStatus == GoalDayRecordRequestStatus.PENDING) ||
                (goalCurrentDayRecordReq.requestId != bytes32(0) && goalCurrentDayRecordReq.requestStatus == GoalDayRecordRequestStatus.FULFILLED)
            )
            // && goal.hasPendingRecordRequestFulfillment == false
        ;
    
        return (upkeepNeededInCheckup, checkData);
    }

    function performUpkeep(
        bytes calldata performData
    ) external override {
        (uint goalId) = abi.decode(performData, (uint));

        Goal storage goal = goalsMap[goalId];
        require(goal.id == goalId, 'goal is not exist');

        GoalDayRecordReq storage goalCurrentDayRecordReq = goalsDaysRecordsReqsMap[goal.currentDayRecordRequestId];
        require(goal.id == goalId, 'goal current request is not exist');

        GoalDayRecordReq storage goalDayRecordReq = goalsDaysRecordsReqsMap[goal.currentDayRecordRequestId];
        require(goalDayRecordReq.requestId == goal.currentDayRecordRequestId, 'goal day record req is not exist');

        bool isNextGoalCheckInterval = env != ENV.LOCALNET
            ? ((block.timestamp - goal.lastDayRecordTimestamp) > goalCheckInterval)
            : true
        ;

        bool upkeepNeededInPerform = 
            (isNextGoalCheckInterval) &&
            (goal.dayRecordsCount < goal.durationDaysCount) &&
            (goal.status == GoalStatus.ACTIVE) && 
            (
                (goalCurrentDayRecordReq.requestId == bytes32(0) && goalCurrentDayRecordReq.requestStatus == GoalDayRecordRequestStatus.PENDING) ||
                (goalCurrentDayRecordReq.requestId != bytes32(0) && goalCurrentDayRecordReq.requestStatus == GoalDayRecordRequestStatus.FULFILLED)
            )
            // && goal.hasPendingRecordRequestFulfillment == false
        ;

        // enum GoalDayRecordRequestStatus { REQUESTED, FULFILLED, PROCESSED }
        // processGoalDayRecord(goalDayRecordReq.goalId, goalDayRecordReq.requestId, goalDayRecordReq.stepsCount);

        if (upkeepNeededInPerform) {
            if (goalCurrentDayRecordReq.requestId == bytes32(0) && goalCurrentDayRecordReq.requestStatus == GoalDayRecordRequestStatus.PENDING) {
                requestGoalDayRecord(goal.id);
            }

            if (goalCurrentDayRecordReq.requestId != bytes32(0) && goalCurrentDayRecordReq.requestStatus == GoalDayRecordRequestStatus.FULFILLED) {
                processGoalDayRecord(goalDayRecordReq.goalId, goalDayRecordReq.requestId, goalDayRecordReq.stepsCount);
            }
        }
    }

    function _createRequest(uint goalId, bytes32 requestId) public {
        Goal storage goal = goalsMap[goalId];
        require(goal.id == goalId, 'goal is not exist');

        GoalDayRecordReq storage goalDayRecordReq = goalsDaysRecordsReqsMap[requestId];
        require(goalDayRecordReq.requestId == '', 'goal day record req is already exist');

        goal.currentDayRecordRequestId = requestId;
        goalDayRecordReq.requestId = requestId;
        goalDayRecordReq.goalId = goalId;
        goalDayRecordReq.dateTimestamp = block.timestamp;
        goalDayRecordReq.requestStatus = GoalDayRecordRequestStatus.REQUESTED;
    }

    function requestGoalDayRecord(uint goalId) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        Goal storage goal = goalsMap[goalId];
        require(goal.id == goalId, 'goal is not exist');

        uint nextDayRecordId = goal.dayRecordsCount + 1;

        string memory url = string(abi.encodePacked(stepsHunterBackendHost, '/goals/', Strings.toString(goalId), '/records/', Strings.toString(nextDayRecordId)));

        req.add('get', url);
        req.add('path', 'stepsCount');
        req.addInt('times', 1);

        bytes32 chainLinkRequestId = sendChainlinkRequest(req, fee);

        // goal.hasPendingRecordRequestFulfillment = true;
        _createRequest(goalId, chainLinkRequestId);

        emit CreateReq(chainLinkRequestId);

        // Sends the request
        return chainLinkRequestId;
    }

    function _fulfill(bytes32 _requestId, uint _stepsCount) public {
        GoalDayRecordReq storage goalDayRecordReq = goalsDaysRecordsReqsMap[_requestId];
        require(goalDayRecordReq.requestId == _requestId, 'goal day record req is not exist');

        require(goalDayRecordReq.requestStatus != GoalDayRecordRequestStatus.FULFILLED, 'goal day record req is already fulfilled');

        goalDayRecordReq.stepsCount = _stepsCount;
        goalDayRecordReq.requestStatus = GoalDayRecordRequestStatus.FULFILLED;

        Goal storage goal = goalsMap[goalDayRecordReq.goalId];
        require(goal.id == goalDayRecordReq.goalId, 'goal is not exist');

        // goal.hasPendingRecordRequestFulfillment = false;
        // goal.hasPendingRecordRequestProcession = true;

        // processGoalDayRecord(goalDayRecordReq.goalId, goalDayRecordReq.requestId, goalDayRecordReq.stepsCount);
    }

    function fulfill(bytes32 _requestId, uint _stepsCount) public recordChainlinkFulfillment(_requestId) {
        _fulfill(_requestId, _stepsCount);
        emit FulfillRes(_requestId, _stepsCount);
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), 'Unable to transfer');
    }

    function updateStepsHunterBackendHost(string memory _stepsHunterBackendHost) public onlyOwner {
        stepsHunterBackendHost = _stepsHunterBackendHost;
    }
}
