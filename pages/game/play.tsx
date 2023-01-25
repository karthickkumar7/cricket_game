import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Runrate from '../../components/RunRate';
import Scorecard from '../../components/Scorecard';
import Table from '../../components/Table';
import { RootState } from '../../redux/store';
import {
    setBattingTeam,
    setBowlingTeam,
} from '../../redux/reducers/gameReducer';
import { BattingTeam, BowlingTeam, Lineup, Squad } from '../../typeDefs/types';
import Runs from '../../components/Runs';
import InterTable from '../../components/SessionOneInterComp';

const Play = () => {
    const {
        playerChose,
        playerTeam,
        oppTeam,
        sessionOneCompleted,
        sessionOneCompletedStatComp,
        sessionOne,
        battingTeam,
        bowlingTeam,
        over,
    } = useSelector((s: RootState) => s.game);
    const dispatch = useDispatch();

    function createBattingTeam(playerBat: boolean) {
        const batTeam = playerBat ? playerTeam : oppTeam;

        const createOnStandPLayer = batTeam?.players[0].id;
        const createOffStandPLayer = batTeam?.players[1].id;
        const createRemainingPlayers: string[] = [];
        const createSquad: Squad[] = [];

        if (batTeam?.players)
            for (let i = 0; i < batTeam?.players.length; i++) {
                if (
                    batTeam?.players[i].id &&
                    ![createOnStandPLayer, createOffStandPLayer].includes(
                        batTeam?.players[i].id
                    )
                )
                    createRemainingPlayers.push(batTeam?.players[i].id);
            }

        if (batTeam?.players)
            createSquad.push(
                ...batTeam?.players.map((p) => {
                    return {
                        id: p.id,
                        name: p.name,
                        four: 0,
                        six: 0,
                        runs: 0,
                        wicket: '',
                    };
                })
            );

        const createBattingTeam: BattingTeam = {
            squad: createSquad,
            onStand: createOnStandPLayer || '',
            offStand: createOffStandPLayer || '',
            remaining: createRemainingPlayers,
            out: [],
            name: batTeam?.name || '',
            score: 0,
        };

        return createBattingTeam;
    }

    function createBowlingTeam(playerBowl: boolean) {
        const bowlTeam = playerBowl ? playerTeam : oppTeam;

        const createCurrentBowler =
            bowlTeam?.players[
                Math.floor(Math.random() * bowlTeam.players.length)
            ].id;
        const createRemainingBowler: string[] = [];
        const createLineUp: Lineup[] = [];

        if (bowlTeam?.players)
            createLineUp.push(
                ...bowlTeam?.players.map((p) => {
                    return {
                        id: p.id,
                        name: p.name,
                        economy: 0,
                        wickets: 0,
                        overs: 0,
                        runs: 0,
                    };
                })
            );

        if (bowlTeam?.players)
            for (let i = 0; i < bowlTeam.players.length; i++) {
                if (
                    createCurrentBowler &&
                    bowlTeam.players[i].id !== createCurrentBowler
                )
                    createRemainingBowler.push(bowlTeam.players[i].id);
            }

        const createBowlingTeam: BowlingTeam = {
            currentBowler: createCurrentBowler || '',
            prevBowler: '',
            lineup: createLineUp,
            remainingBowler: createRemainingBowler,
            name: bowlTeam?.name || '',
            overDeci: 0,
            overFlt: 0,
        };

        return createBowlingTeam;
    }

    function gameInit() {
        if (playerChose === 'bat') {
            // set player to bat
            dispatch(setBattingTeam(createBattingTeam(true)));
            dispatch(setBowlingTeam(createBowlingTeam(false)));
        } else {
            // set player to bowl
            dispatch(setBattingTeam(createBattingTeam(false)));
            dispatch(setBowlingTeam(createBowlingTeam(true)));
        }
    }

    function returnHomeHandler() {
        window.location.href = '/';
    }

    // create bat and bowl team
    // create after session is completed
    useEffect(() => {
        gameInit();
    }, [sessionOneCompleted]);

    return (
        <div className="w-screen h-screen py-8 flex flex-col items-center space-y-4 bg-slate-900 text-white">
            {!sessionOneCompletedStatComp ? (
                <>
                    {/* score card */}
                    <Scorecard />

                    <div className="w-[85%] lg:w-[40%] lg:h-[200px] flex flex-col lg:flex-row lg:justify-between space-y-4 lg:space-y-0">
                        {/* runrate */}
                        <Runrate />
                        {/* runs */}
                        <Runs />
                    </div>

                    {/* stats */}
                    <div className="w-[85%] lg:w-[40%]">
                        <Table />
                    </div>
                    {sessionOneCompleted && (
                        <div className="w-[85%] lg:w-[40%] h-[90px] flex flex-col justify-center px-4 rounded-lg bg-orange-600">
                            <p className="uppercase text-2xl text-bold">
                                target : {sessionOne.batting.score}
                            </p>
                            <p className="lg:text-base text-sm">
                                <span className="capitalize">
                                    {battingTeam?.name}
                                </span>{' '}
                                needs{' '}
                                <span className="font-bold">
                                    {battingTeam &&
                                        sessionOne.batting.score -
                                            battingTeam?.score}{' '}
                                </span>
                                runs from{' '}
                                <span className="font-bold">
                                    {bowlingTeam &&
                                        over * 6 -
                                            bowlingTeam?.overDeci * 6 +
                                            bowlingTeam.overFlt}
                                </span>{' '}
                                balls
                            </p>
                        </div>
                    )}
                </>
            ) : (
                <InterTable />
            )}
        </div>
    );
};

export default Play;
