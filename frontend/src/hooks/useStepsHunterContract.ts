import { useCallback, useState } from "react";
import { Address } from 'wagmi';
import moment from 'moment';
import { BigNumber, ethers } from "ethers";

import { useMagicLink } from "./useMagicLink";
import { useUserContext } from "../contexts/UserContext";
import { StepsHunter__factory, ERC20Token__factory, StepsHunterNft__factory, StepsHunter, StepsHunterNft } from '../blockchain/typechain-types';
import {
    GoalStatus,
    GoalDayRecordStatus,
    IOffchainGoal,
    GoalDayRecord,
    GoalNftMetadataAttributeId,
    GoalNftMetadataAttributeIndexIdMap,
    GoalNftMetadataAttribute,
    GoalNftMetadata,
    IGoal,
    GoalStatusNameMap
  }  from '../types'

const stepsHunterContractAddress = process.env.REACT_APP_STEPS_HUNTER_CONTRACT_ADDRESS as Address;

export const useStepsHunter = () => {
    const { provider } = useMagicLink();
  
    const getGoalNftMetadata = async (goalId: number, stepsHunterNftContract: StepsHunterNft): Promise<GoalNftMetadata | undefined> => {
        try {    
          const goalNftURI = await stepsHunterNftContract.tokenURI(goalId)
    
          const goalNftMetadataBase64Encoded = goalNftURI?.split(',')[1] || undefined
          if (!goalNftMetadataBase64Encoded) return undefined
    
          const goalNftMetadataDecoded: GoalNftMetadata = JSON.parse(atob(goalNftMetadataBase64Encoded))
          if (!goalNftMetadataDecoded) return undefined
    
          const goalNftImageSvgBase64Encoded = goalNftMetadataDecoded?.image.split(',')[1] || undefined
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
    
          return goalNftMetadata;
    
        } catch (error) {
          console.error(error);
    
          return undefined;
        }
      }
    
    const getGoalDayRecord = async (goal: IOffchainGoal, goalDayRecordIndex: number, stepsHunterContract: StepsHunter): Promise<GoalDayRecord | undefined> => {
        const goalDayRecord = await stepsHunterContract.goalsDayRecordsMap(goal.onchainId, goalDayRecordIndex);

        if (!goalDayRecord) return undefined

        const {
            id,
            // requestId,
            dateTimestamp,
            // goalId,
            stepsCount,
            status
        } = goalDayRecord;

        const dayRecordIndex =id.toNumber();

        const parsedGoalDayRecord = {
            id: dayRecordIndex, // goalDayRecordIndex
            status: status,
            statusName: GoalDayRecordStatus[status],
            trackDayTimestamp: moment(goal.startDateTimestamp).clone().add(dayRecordIndex - 1, 'days').startOf('day').valueOf(),
            recordDateTimestamp: dateTimestamp.toNumber(),
            stepsCount: stepsCount.toNumber(),
        }

        return parsedGoalDayRecord
    }

    const getGoalDayRecords = async (offchainGoal: IOffchainGoal, recordsCount: number, stepsHunterContract: StepsHunter): Promise<GoalDayRecord[]> => {
        const getGoalDayRecordsRequests = Array.from(Array(recordsCount)).map((_, dayRecordIndex) => 
          getGoalDayRecord(offchainGoal, dayRecordIndex + 1, stepsHunterContract)
        )

        const goalDayRecords = await Promise.all(getGoalDayRecordsRequests);

        return goalDayRecords.filter(goalDayRecord => !!goalDayRecord) as any as GoalDayRecord[]
    }

    const getGoal = async (goal: IOffchainGoal, userAddress: string): Promise<IGoal | undefined> => {
        const address = userAddress;
        if (!address) return;

        const signer = provider.getSigner(address);
        const stepsHunterContract = StepsHunter__factory.connect(stepsHunterContractAddress, signer);

        const stepsHunterNftContractAddress = await stepsHunterContract.stepsHunterNft()
        const stepsHunterNftContract = await StepsHunterNft__factory.connect(stepsHunterNftContractAddress, signer);

        const onchainGoal = await stepsHunterContract.goalsMap(goal.onchainId);

        if (!onchainGoal) return undefined

        const {
            id,
            status,
            durationDaysCount,
            dayRecordsCount,
            // hasPendingRecordRequest,
            lastDayRecordTimestamp,
            maxFailDaysCount,
            failDaysCount,
            dailyStepsCount,
            betAmount,
            userAddr,
            upkeepID,
        } = onchainGoal;

        const parsedGoal: IGoal = {
            id: id.toNumber(), //goalId
            status: GoalStatusNameMap[status as GoalStatus],
            durationDaysCount: durationDaysCount.toNumber(),
            dayRecordsCount: dayRecordsCount.toNumber(),
            lastDayRecordTimestamp: lastDayRecordTimestamp.toNumber(),
            maxFailDaysCount: maxFailDaysCount.toNumber(),
            failDaysCount: failDaysCount.toNumber(),
            dailyStepsCount: dailyStepsCount.toNumber(),
            betAmount: ethers.utils.formatEther(betAmount.toString()),
            userAddr: userAddr,
            goalDayRecords: await getGoalDayRecords(goal, dayRecordsCount.toNumber(), stepsHunterContract),
            goalNft: await getGoalNftMetadata(goal.onchainId, stepsHunterNftContract),
            upkeepID: upkeepID.toString(),
            startDateTimestamp: goal.startDateTimestamp,
            endDateTimestamp: goal.endDateTimestamp,
        }

        console.log('parsedGoal', parsedGoal)

        return parsedGoal
    }
    
    return {
        getGoalNftMetadata,
        getGoalDayRecords,
        getGoal
    };
}
