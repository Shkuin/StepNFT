import { Box, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useCallback, useMemo, useEffect } from "react";
import cn from 'classnames';
import { BigNumber, ContractReceipt, ethers } from "ethers";
import { useBalance, Address, erc20ABI, useContractWrite, usePrepareContractWrite, useContractRead } from 'wagmi'

import axios, { AxiosError, AxiosResponse } from 'axios';

import { routes } from "../../routes";

import Header from "../../components/Header";
import Page from "../../components/Page";
import Slider from "../../components/Slider";
import DaysPicker from "../../components/DaysPicker";
import Caption from "../../components/Caption";
import { GoogleSyncButton } from "../../components/GoogleSyncButton";

import { IGoal } from '../../types';

import { useUserContext } from "../../contexts/UserContext";
import { StepsHunter__factory, ERC20Token__factory, StepsHunter } from '../../blockchain/typechain-types';
import { GoalCreatedEventObject } from "../../blockchain/typechain-types/contracts/StepsHunter.sol/StepsHunter";

import { acceptableFailedDaysMarks, stepsPerDayMarks, betMarks, daysMarks } from "./SetGoal.data";

const stepsHunterContractAddress = process.env.REACT_APP_STEPS_HUNTER_CONTRACT_ADDRESS as Address;
const linkTokenAddress = process.env.REACT_APP_LINK_TOKEN_ADDRESS as Address;
const backendUrl = process.env.REACT_APP_BACKEND_URL as string;

export type CreateGoalDto = {
  onchainId: number; // id generated on contract
  // userId: string; // link to user entity
  startDateTimestamp: number; // goal period start date with UTC-offset (user local time) (start of day e.g 'Wed Nov 15 2022 00:00:00 GMT+0300')
  endDateTimestamp: number; // goal period end date with with UTC-offset (user local time) (end of day e.g 'Wed Nov 17 2022 23:59:59 GMT+0300')
  durationInDaysCount: number; // duration of goal in days. e.g  endDateDay - startDateDay = 3 days
  // dayRecordsCount: number; // how much day record already created;
  requiredDailyStepsCount: number; // required steps per day
  acceptableFailedDaysCount: number; //max failed days
  // failedDaysCount: number; // failed days count
  betAmount: string; // 10000000000000000 wei = 1 LINK. For now bets only made in Link
  userTimeZoneOffset: number; // user timezone offset from GMT. e.g +3 for user from moscow timezone
};

const getGoalIdFromCreateGoalTxReceipt = (receipt: ContractReceipt, stepsHunterContract: StepsHunter) => {
  const event = receipt.events?.find((event) => event?.eventSignature === "GoalCreated(uint256,uint256)");
  if (!event) return undefined;

  const parsedEvent = stepsHunterContract.interface.parseLog(event);
  const args: GoalCreatedEventObject = parsedEvent.args as any as GoalCreatedEventObject;

  if (!args.goalId) return undefined;

  return args.goalId.toNumber();
}

const backendAPI = axios.create({ baseURL: backendUrl });

const CreateGoal = () => {
  const navigate = useNavigate();
  const [durationInDays, setDurationInDays] = useState(1);
  const [requiredDailyStepsCount, setRequiredDailyStepsCount] = useState(3);
  const [betAmount, setBetAmount] = useState(2);
  const [acceptableFailedDaysCount, setAcceptableFailedDaysCount] = useState(1);
  const [activeDays, setActiveDays] = useState<Record<number, boolean>>(
    {
      0: true,
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
    }
  );

  const [isSuccessSnackbarOpened, setIsSuccessSnackbarOpened] = useState(false);
  const [isErrorSnackbarOpened, setIsErrorSnackbarOpened] = useState(false);

  const [isCreateGoalPending, setIsCreateGoalPending] = useState(false);
  const [isAllowLinkPending, setIsAllowLinkPending] = useState(false);

  const { setUserMetadata, userMetadata, didToken, provider, magic, isUserAuthorized, isInitialAuthorizationPending  } = useUserContext();

  const linkBalance = useBalance({
    address: userMetadata?.publicAddress as Address,
    formatUnits: 18,
    token: linkTokenAddress,
    enabled: !!userMetadata?.publicAddress
  })

  const maticBalance = useBalance({
    address: userMetadata?.publicAddress as Address,
    formatUnits: 18,
    enabled: !!userMetadata?.publicAddress
  })

  const goalParams = useMemo(() => {
     const goalReqParams: Omit<CreateGoalDto, 'onchainId'> = {
      startDateTimestamp: 1,
      endDateTimestamp: 1,
      durationInDaysCount: durationInDays,
      requiredDailyStepsCount: requiredDailyStepsCount * 1000, // 1k
      acceptableFailedDaysCount: acceptableFailedDaysCount,
      betAmount: BigNumber.from(betAmount).mul(ethers.constants.WeiPerEther).toString(), // '2000000000000000000',
      userTimeZoneOffset: 0,
    };

    return goalReqParams;
  }, [requiredDailyStepsCount, acceptableFailedDaysCount, betAmount, durationInDays])

  const linkAmountRequired: BigNumber = useMemo(() => {
    const stepsHunterGoalFee = ethers.BigNumber.from(1).mul(ethers.constants.WeiPerEther) // 1 Ether
    const chainlinkApiRequestCostAmount = ethers.BigNumber.from('100000000000000000') // 0.1 Ether
    const chainlinkAutomationUpkeepPerformCostAmount = ethers.BigNumber.from('100000000000000000') // 0.1 Ether
    const goalChainlinkInfrastructureCost = chainlinkApiRequestCostAmount.mul(goalParams.durationInDaysCount)
      .add(chainlinkAutomationUpkeepPerformCostAmount.mul(goalParams.durationInDaysCount).mul(2))
    const totalGoalPayment = stepsHunterGoalFee.add(goalChainlinkInfrastructureCost).add(goalParams.betAmount)

    return totalGoalPayment
  }, [goalParams,])

  const isEnoughLinkBalance = useMemo(() => {
    return (linkBalance.isFetched && (linkBalance.data?.value.gte(linkAmountRequired)));
  }, [linkBalance, linkAmountRequired])

  const isEnoughMaticBalance = useMemo(() => {
    const maticAmountRequired = BigNumber.from('20000000000000000') // 0.02 Ether
    return (maticBalance.isFetched && (maticBalance.data?.value.gte(maticAmountRequired)));
  }, [maticBalance])


  const { data: linkTokenAllowanceData, isFetched: linkTokenAllowanceFetched } = useContractRead({
    address: linkTokenAddress,
    enabled: !!userMetadata?.publicAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [userMetadata?.publicAddress!! as Address, stepsHunterContractAddress] //owner, spender
  })

  const isLinkAmountRequiredAllowed = useMemo(() => {
    const res = linkTokenAllowanceFetched && linkTokenAllowanceData?.gte(linkAmountRequired)

    return res;
  }, [linkTokenAllowanceData, linkTokenAllowanceFetched, linkAmountRequired])

  const handleApproveLink = useCallback(async () => {
    setIsAllowLinkPending(true);

      try {
        const address = userMetadata?.publicAddress;
        if (!address) return;

        const signer = provider.getSigner(address)
        const linkTokenContract = ERC20Token__factory.connect(linkTokenAddress, signer)

        const approveTx = await linkTokenContract.approve(
          stepsHunterContractAddress,
          linkAmountRequired.mul(30),
          { gasLimit: 10_000_000 }
        )

        console.log('approveTx', approveTx)

        const approveTxReceipt = await approveTx.wait(1);

        setIsAllowLinkPending(false);

        console.log('approveTxReceipt', approveTxReceipt)
      } catch (error) {
        setIsAllowLinkPending(false);
        console.error(error)
      }
   }, [linkAmountRequired])

  let isCreateGoalBtnActive = useMemo(() => {
    return (isLinkAmountRequiredAllowed && isEnoughLinkBalance && isEnoughMaticBalance && !isCreateGoalPending);
  }, [isLinkAmountRequiredAllowed, isEnoughLinkBalance, isEnoughMaticBalance, isCreateGoalPending])

  const handleCreateGoal = useCallback(async() => {    
    const address = userMetadata?.publicAddress;
    if (!address) return;

    setIsCreateGoalPending(true);

    try {
      const signer = provider.getSigner(address)
      const stepsHunterContract = StepsHunter__factory.connect(stepsHunterContractAddress, signer)

      const createGoalTx = await stepsHunterContract.createGoal({
        durationDaysCount: goalParams.durationInDaysCount,
        maxFailDaysCount: goalParams.acceptableFailedDaysCount,
        dailyStepsCount: goalParams.requiredDailyStepsCount,
        betAmount: goalParams.betAmount
      }, { gasLimit: 10_000_000 })

      console.log('createGoalTx', createGoalTx)

      const createGoalTxReceipt = await createGoalTx.wait(1);
      console.log('createGoalTxReceipt', createGoalTxReceipt)

      const goalId = getGoalIdFromCreateGoalTxReceipt(createGoalTxReceipt, stepsHunterContract);
      if (!goalId) throw new Error('Goal id is not defined')

      console.log('goalId', goalId)

      const createGoalReqBody: CreateGoalDto = {
        ...goalParams,
        onchainId: goalId
      };

      const createdGoal = await backendAPI.post<any, AxiosResponse<IGoal>, CreateGoalDto>(`/goals`, createGoalReqBody, {
        headers: {
          'Authorization': 'Bearer ' + didToken,
        }
      })
        .then(res => res.data)
        .catch((error: AxiosError) => {
          console.log('create gol req failed', error.message || 'unknown error');

          return null
        })

      if (!createdGoal) return;

      toggleSuccessSnackbar(true);
      setIsCreateGoalPending(false);
      setIsSuccessSnackbarOpened(true);

      navigate(`/goals/${goalId}`);
      // console.log('createGoalTx', createGoalTx)

      // const goal = await stepsHunterContract?.goalsMap(BigNumber.from('1'))
    } catch (error) {
      console.error(error);
      setIsCreateGoalPending(false);
      toggleErrorSnackbar(true);
    }
  }, [provider, goalParams, didToken, userMetadata])


  const toggleSuccessSnackbar = (flag: boolean) => {
    setIsSuccessSnackbarOpened(flag);
  }

  const toggleErrorSnackbar = (flag: boolean) => {
    setIsErrorSnackbarOpened(flag);
  }

  useEffect(() => {
    if (!isUserAuthorized && !isInitialAuthorizationPending) {
      navigate(routes.authLogin);
    }
  }, [isUserAuthorized, isInitialAuthorizationPending, navigate])


  return (
    <Page>
      <Header routeBack={routes.home} title="Goal creation" />

      <Box>
        <Box className="mb-4">
          <Slider
            containerStyles={{}}
            title="Steps per day"
            marks={stepsPerDayMarks}
            onChange={(_, value) => {
              if (!Array.isArray(value)) {
                setRequiredDailyStepsCount(value);
              }
            }}
            value={requiredDailyStepsCount}
          />
        </Box>
    
        <Box className="mb-4">
          <Caption>Days of the week</Caption>
          <DaysPicker
            active={activeDays}
            setActive={setActiveDays}
            containerStyles={{ mt: "10px" }}
          />
        </Box>


        <Box className="mb-4">
          <Slider
            containerStyles={{}}
            title="Duration in days"
            marks={daysMarks}
            onChange={(_, value) => {
              if (!Array.isArray(value)) {
                setDurationInDays(value);
              }
            }}
            value={durationInDays}
          />
        </Box>

        <Box className="mb-4">
          <Slider
            containerStyles={{}}
            title="Allowed to fail days"
            marks={acceptableFailedDaysMarks}
            onChange={(_, value) => {
              if (!Array.isArray(value)) {
                setAcceptableFailedDaysCount(value);
              }
            }}
            value={acceptableFailedDaysCount}
          />
        </Box>

        <Box className="mb-4">
          <Slider
            containerStyles={{}}
            title="Bet amount (LINK)" 
            marks={betMarks}
            onChange={(_, value) => {
              if (!Array.isArray(value)) {
                setBetAmount(value);
              }
            }}
            value={betAmount}
          />
        </Box>  
        
        <Box className="mb-4">
          <GoogleSyncButton />
        </Box> 

        <Box className="mb-4">
          <div className="flex items-center">
            <span className="mr-2">LINK balance:</span>
            <span className="mr-2">{linkBalance.isLoading ? '...' : Number(linkBalance.data?.formatted || '0').toPrecision(3)}</span>
            {!isEnoughLinkBalance && (<span className="text-red-600 text-sm "> (Not enough balance)</span>)}
          </div>

          {/* <div className="flex items-center">
            <span className="mr-2">LINK allowance:</span>
            <span className="mr-2">{linkTokenAllowanceData ? Number(linkTokenAllowanceData.div(1000000000000000000) || '0').toPrecision(3) : '...'}</span>
          </div> */}

          <div className="flex items-center">
            <span className="mr-2">MATIC balance:</span>
            <span className="mr-2">{maticBalance.isLoading ? '...' : Number(maticBalance.data?.formatted || '0').toPrecision(3)}</span>
            {!isEnoughMaticBalance && (<span className="text-red-600 text-sm "> (Not enough balance)</span>)}
          </div>
        </Box>

        {!isLinkAmountRequiredAllowed && (
          <Box className="mb-4">
              <Button
                onClick={handleApproveLink}
                size='large'
                // className={cn("text-accent mt-6", (!isCreateGoalBtnActive && 'pointer-events-none opacity-30'))} 
                className={cn(
                  "text-accent mt-6",
                  "w-full",
                  'h-12',
                  '!rounded-[52px]',
                  '!text-2xl',
                  '!font-bold',
                  "!font-['montserrat']",
                  'italic',
                  (isAllowLinkPending && 'pointer-events-none opacity-30')
                )} 
                variant="contained"
              >
                Allow LINK spend
              </Button>
            </Box>
        )}

        <Box>
          <Button
            onClick={handleCreateGoal}
            size='large'
            className={cn(
              "text-accent mt-6",
              "w-full",
              'h-12',
              '!rounded-[52px]',
              '!text-2xl',
              '!font-bold',
              "!font-['montserrat']",
              'italic',
              (!isCreateGoalBtnActive && 'pointer-events-none opacity-30')
            )} 
            variant="contained"
          >
            Place a bet
          </Button>
        </Box>
      </Box>
    
      <Snackbar
        open={isSuccessSnackbarOpened}
        autoHideDuration={5000}
        onClose={() => toggleSuccessSnackbar(false)}
        action={''}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Goal is created. Congrats!
        </Alert>
      </Snackbar>

      <Snackbar
        open={isErrorSnackbarOpened}
        autoHideDuration={5000}
        onClose={() => toggleErrorSnackbar(false)}
        action={''}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Goal is not created. Please try again.
        </Alert>
      </Snackbar>
    </Page>
  );
};

export default CreateGoal;
