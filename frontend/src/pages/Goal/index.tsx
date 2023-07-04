import { useEffect, useState } from "react";
import moment from 'moment';
import cn from 'classnames';
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import { useNavigate, PathRouteProps, useParams } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Address } from 'wagmi'
import { ReactSVG } from 'react-svg';

import { useMagicLink } from "../../hooks/useMagicLink";
import { useStepsHunter } from "../../hooks/useStepsHunterContract";
import openseaLogo from './opensea.svg';

import {
  IOffchainGoal,
  IGoal,
  GoalDayRecordStatus}  from '../../types'

import Header from "../../components/Header";
import Page from "../../components/Page";
import { routes } from "../../routes";
import { useUserContext } from "../../contexts/UserContext";
import Caption from "../../components/Caption";

const backendUrl = process.env.REACT_APP_BACKEND_URL as string;
const stepsHunterContractAddress = process.env.REACT_APP_STEPS_HUNTER_CONTRACT_ADDRESS as Address;
const stepsHunterNftContractAddress = process.env.REACT_APP_STEPS_HUNTER_NFT_CONTRACT_ADDRESS as Address;

const backendAPI = axios.create({ baseURL: backendUrl });

// function SVGComponent({ svgString, className }: { svgString: string, className: string }) {
//   const svgStringWithWidth = svgString.replace('width="268"', 'width="100%"').replace('height="386"', '');
//   return <div dangerouslySetInnerHTML={{ __html: svgStringWithWidth }}/>;
// }

const SVGComponent = ({ svgString, className }: { svgString: string, className: string }) => {
  const svgStringWithWidth = svgString.replace('width="268"', 'width="100%"').replace('height="386"', '');
  return (<ReactSVG src={`data:image/svg+xml;utf8,${encodeURIComponent(svgStringWithWidth)}`} />);
};

const Goal  = () => {
  const navigate = useNavigate();
  const { id: goalId } = useParams<'id'>()

  const { userMetadata, didToken, isUserAuthorized, isInitialAuthorizationPending } = useUserContext();
  const { getGoal } = useStepsHunter()

  const [goal, setGoal] = useState<IGoal | undefined>(undefined);
  const [isGoalRequested, setIsGoalRequested] = useState(false)
  const [isGoalLoading, setIsGoalLoading] = useState<boolean>(true);

  const getOffchainGoal = async (onchainId: number, didToken: string, userAddress: string) => {
    const offChainGoal = await backendAPI.get<any, AxiosResponse<IOffchainGoal>>(`/goals/${goalId}`, {
      headers: {
        'Authorization': 'Bearer ' + didToken,
      }
    })
      .then(res => res.data)
      .catch((error: AxiosError) => {
        console.log('create gol req failed', error.message || 'unknown error');

        return null
      })

    if (!offChainGoal) return null;

    console.log('before')
    const goal = await getGoal(offChainGoal, userAddress)
    console.log('after')

    return goal
  }

  useEffect(() => {
    if (isUserAuthorized && didToken && userMetadata?.publicAddress && goalId && !isGoalRequested) {
      setIsGoalRequested(true)
        getOffchainGoal(Number(goalId), didToken, userMetadata.publicAddress)
          .then(goal => {
            if (!goal) return
            setGoal(goal);
            setIsGoalLoading(false);
          })
    }
  }, [isUserAuthorized, didToken, userMetadata, goalId]);

  useEffect(() => {
    if (!isUserAuthorized && !isInitialAuthorizationPending) {
      navigate(routes.authLogin);
    }
  }, [isUserAuthorized, isInitialAuthorizationPending, navigate])

  const dayRecordStatusColorMap: Record<GoalDayRecordStatus, string> = {
    [GoalDayRecordStatus.PENDING]: '#F7B578',
    [GoalDayRecordStatus.SUCCESS]: '#D0F778',
    [GoalDayRecordStatus.FAIL]: '#EE311F',
  }

  return (
    <Page isLoading={isGoalLoading}>
      {goal && (
        <>
          <Header title={`Goal #${goal.id}`}/>

          <Typography
            color="secondary"
            fontFamily="montserrat"
            fontWeight={500}
          >
            {`${goal.dailyStepsCount} steps daily from ${moment(goal.startDateTimestamp).format("dddd, D MMM")} to ${moment(goal.endDateTimestamp).format("dddd, D MMM")}`}
          </Typography>

          <Box className="mt-4">
            <Box className="flex items-center justify-center">
                <div className="w-1/2 mr-2">
                  {goal.goalNft?.image && (
                    <SVGComponent className="" svgString={goal.goalNft?.image} />
                  )}
                </div>

                <div className="w-1/2 ml-2">
                  <Box className="flex flex-col text-[#828498] text-sm mb-4">
                    <div>Duration: {goal.durationDaysCount} days</div>
                    <div>Tracked: {goal.dayRecordsCount} days</div>
                    <div>Allowed to fail: {goal.maxFailDaysCount} days</div>
                    {/* <div>failDaysCount: {goal.failDaysCount}</div> */}
                    {/* <div>dailyStepsCount: {goal.dailyStepsCount}</div> */}
                  </Box>
                  <a
                    href={`https://testnets.opensea.io/assets/mumbai/${stepsHunterNftContractAddress}/${goal.id}`}
                    className="flex items-center justify-center white-space: nowrap;"
                    target='_blank' rel="noreferrer"
                  >
                    <div className="mr-2 text-[#828498] text-xs decoration-solid">View on</div> 
                    <img className="w-[100px]" src={openseaLogo}/>
                  </a>
                </div>
            </Box>

              <Box className="mt-8">
                <div className="flex rounded-lg bg-[#1D1F36] items-center justify-center px-4 py-2 text-sm font-medium text-[#828498]">
                    <div className="w-1/4">STATUS</div>
                    <div className="w-2/4">DATE</div>
                    <div className="w-1/4">STEPS</div>
                </div>
                

                {goal.goalDayRecords.map((goalDayRecord) => (
                  <div className="flex items-center justify-center px-4 py-2 text-sm font-medium text-[#828498]" key={goalDayRecord.id}>
                    <div className="hidden text-[#F7B578]' 'text-[#D0F778]' 'text-[#EE311F]"></div>
                    <div
                      className={cn(
                        'w-1/4',
                        `text-[${dayRecordStatusColorMap[goalDayRecord.status]}]`
                      )}
                    >
                      {goalDayRecord?.statusName}
                    </div> 
                    <div className="w-2/4">{moment(goalDayRecord?.trackDayTimestamp).format("dddd, D MMM")}</div> 
                    <div className="w-1/4">{goalDayRecord?.stepsCount}</div> 
                  </div>
                ))}
              </Box>


              <Box className="mt-8">
                <Box>
                  <Caption>Links:</Caption>
                    <Box>
                      <a
                        href={`https://automation.chain.link/mumbai/${goal.upkeepID}`}
                        className="decoration-solid"
                        target='_blank'
                      >
                        Goal's Chainlink Upkeep
                    </a>
                    </Box>


                    <Box>
                      <a
                        href={`https://mumbai.polygonscan.com/address/${stepsHunterContractAddress}`}
                        className="decoration-solid mt-4"
                        target='_blank'
                      >
                        Goals Hunter Contract
                      </a>
                    </Box>

                    <Box>
                      <a
                        href={`https://mumbai.polygonscan.com/address/${stepsHunterNftContractAddress}`}
                        className="decoration-solid mt-4"
                        target='_blank'
                      >
                        Goals Hunter NFT Contract
                      </a>
                    </Box>
                </Box>
              </Box>
          </Box>
        </>
      )}
    </Page>
  )
};

export default Goal;
