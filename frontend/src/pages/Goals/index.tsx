import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Box, Button, Snackbar, Alert } from "@mui/material";
import { Address } from 'wagmi'
import { random } from "lodash";
import { ReactSVG } from 'react-svg';

import { useMagicLink } from "../../hooks/useMagicLink";
import { useStepsHunter } from "../../hooks/useStepsHunterContract";

import {
  IOffchainGoal,
  IGoal
}  from '../../types'

import Header from "../../components/Header";
import Page from "../../components/Page";
import { routes } from "../../routes";
import { useUserContext } from "../../contexts/UserContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL as string;

const backendAPI = axios.create({ baseURL: backendUrl });


const SVGComponent = ({ svgString, className }: { svgString: string, className: string }) => {
  const svgStringWithWidth = svgString.replace('width="268"', 'width="100%"').replace('height="386"', '');
  return (<ReactSVG src={`data:image/svg+xml;utf8,${encodeURIComponent(svgStringWithWidth)}`} />);
};

// function SVGComponent({ svgString, className }: { svgString: string, className: string }) {
//   const svgStringWithWidth = svgString.replace('width="268"', 'width="100%"').replace('height="386"', '');
//   return <div dangerouslySetInnerHTML={{ __html: svgStringWithWidth }}/>;
// }


const Goal = ({ goal }: { goal: IGoal}) => {
  if (!goal.goalNft) return null;

  return (
    <Link className="mb-6 block" to={`/goals/${goal.id}`}>
      <SVGComponent
          className=""
          svgString={goal.goalNft.image}
      />
    </Link>
  )
}

const Goals = () => {
  const navigate = useNavigate();
  const { userMetadata, didToken, isUserAuthorized, isInitialAuthorizationPending } = useUserContext();
  const { getGoal } = useStepsHunter()

  const [goals, setGoals] = useState<IGoal[]>([]);
  const [isGoalRequested, setIsGoalRequested] = useState(false)

  const getGoals = async (didToken: string, userAddress: string) => {
    console.log('getGoals')
    const offChainGoals = await backendAPI.get<any, AxiosResponse<IOffchainGoal[]>>(`/goals`, {
      headers: {
        'Authorization': 'Bearer ' + didToken,
      }
    })
      .then(res => res.data)
      .catch((error: AxiosError) => {
        console.log('create gol req failed', error.message || 'unknown error');

        return null
      })

    if (!offChainGoals) return null;

    const goals = await Promise.all(offChainGoals.map((offchainGoal) => 
      getGoal(offchainGoal, userAddress) as any as IGoal)
    );

    return goals
  }

  useEffect(() => {
    if (isUserAuthorized && didToken && userMetadata?.publicAddress && !isGoalRequested) {
      setIsGoalRequested(true)

        getGoals(didToken, userMetadata.publicAddress)
          .then(goals => {
            if (!goals) return
            setGoals(goals)
          })
    }
  }, [isUserAuthorized, didToken, userMetadata?.publicAddress, isGoalRequested]);

  useEffect(() => {
    if (!isUserAuthorized && !isInitialAuthorizationPending) {
      navigate(routes.authLogin);
    }
  }, [isUserAuthorized, isInitialAuthorizationPending, navigate])

  return (
    <Page>
      <Header title="Goals"/>

      <Box>
        {goals.map(((goal, index) => (
          <Goal goal={goal} key={goal.id} />
        )))}
      </Box>
    </Page>
  )
};

export default Goals;
