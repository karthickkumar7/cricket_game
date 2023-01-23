import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { runs } from '../data/team';
import {
    changeOutPlayer,
    overFinish,
    resetFltOver,
    setOppRun,
    swapBatsmen,
    updateBattingScore,
    updateOver,
    updateRuns,
    completeSession,
    updateSession,
    setSessionOneCompletedStatsComp,
    addWicketBowlerName,
    increaseBowlerWicket,
    updateCurrentBowlerExpense,
    increaseCurrentBowlerOverAndEconomy,
    setWinTeam,
    calculateRequiredRunRate,
    calculateProjectedScore,
    calculateCurrentRunRate,
} from '../redux/reducers/gameReducer';
import { RootState } from '../redux/store';
import { Squad } from '../typeDefs/types';

const Runs = () => {
    const {
        playerChose,
        battingTeam,
        bowlingTeam,
        over,
        sessionOne,
        sessionOneCompleted,
        gameCompleted,
    } = useSelector((s: RootState) => s.game);
    const dispatch = useDispatch();
    const router = useRouter();
    const bowlerRunsExpense = useRef(0);

    function gameHandler(run: number) {
        const oppRun = runs[Math.floor(Math.random() * runs.length)];
        dispatch(setOppRun(oppRun));

        if (run === oppRun) {
            // OUT logic

            // push current player to the OUT array
            // get the first player from the remaining array
            // remove the player from the remaining array
            // add to the onStand
            // add the bowler to the batsman

            if (battingTeam) {
                let remaining = [...battingTeam?.remaining];
                const out = [...battingTeam.out];

                out.push(battingTeam.onStand);

                const newOnStand = remaining[0];
                remaining = remaining.slice(1);
                dispatch(
                    addWicketBowlerName({
                        currentBatsman: battingTeam.onStand,
                        currentBowler: bowlingTeam?.currentBowler,
                    })
                );

                // increase current bowler wicket
                dispatch(
                    increaseBowlerWicket({
                        currentBowler: bowlingTeam?.currentBowler,
                    })
                );

                dispatch(
                    changeOutPlayer({
                        onStand: newOnStand,
                        remaining,
                        out,
                    })
                );
            }
        } else {
            // RUNs logic
            const playerOrComBatting = playerChose === 'bat' ? run : oppRun;
            const updatedSquad: Squad[] = [];

            // update runs

            // increase bowler expense runs
            bowlerRunsExpense.current += playerOrComBatting;

            if (battingTeam?.squad)
                for (let i = 0; i < battingTeam?.squad.length; i++) {
                    if (battingTeam.squad[i].id === battingTeam.onStand) {
                        let temp = { ...battingTeam.squad[i] };
                        if (playerOrComBatting === 4) temp.four += 1;
                        if (playerOrComBatting === 6) temp.six += 1;
                        temp.runs += playerOrComBatting;
                        updatedSquad.push(temp);
                    } else updatedSquad.push(battingTeam.squad[i]);
                }
            dispatch(updateRuns(updatedSquad));
            dispatch(
                updateBattingScore(
                    battingTeam && battingTeam?.score + playerOrComBatting
                )
            );

            // swap batsman logic
            if (playerOrComBatting === 1 || playerOrComBatting === 3)
                dispatch(
                    swapBatsmen({
                        onStand: battingTeam?.onStand,
                        offStand: battingTeam?.offStand,
                    })
                );
        }

        // inc overs
        if (bowlingTeam?.overFlt === 5) {
            dispatch(resetFltOver());
            dispatch(updateOver({ deci: 1, flt: 0 }));

            // update current bowler expense
            dispatch(
                updateCurrentBowlerExpense({
                    currentBowler: bowlingTeam.currentBowler,
                    runs: bowlerRunsExpense.current,
                })
            );
            bowlerRunsExpense.current = 0;

            // increase over of the bowler
            dispatch(
                increaseCurrentBowlerOverAndEconomy({
                    currentBowler: bowlingTeam.currentBowler,
                })
            );

            // change bowler
            const bowler =
                bowlingTeam.remainingBowler[
                    Math.floor(
                        Math.random() * bowlingTeam.remainingBowler.length
                    )
                ];

            // swaps batsman and saves prev bowler
            dispatch(
                overFinish({
                    prevBowler: bowlingTeam.currentBowler,
                    currentBowler: bowler,
                })
            );

            // calculate current runrate
            dispatch(calculateCurrentRunRate());
        } else {
            dispatch(updateOver({ deci: 0, flt: 1 }));
        }

        // projected score
        dispatch(calculateProjectedScore());
    }

    function targetChasedHandler() {
        if (battingTeam && battingTeam.score >= sessionOne.batting.score) {
            console.log('target chased, you win')!;
            dispatch(setWinTeam(battingTeam.name));
        } else {
            console.log('target not chased, you lose')!;
            dispatch(setWinTeam(bowlingTeam && bowlingTeam.name));
        }
        router.push('/game/gameover');
    }

    // 1st batting
    useEffect(() => {
        if (!sessionOneCompleted && battingTeam && bowlingTeam) {
            // check over is completed!
            // check all out
            if (
                bowlingTeam.overDeci >= over ||
                battingTeam.out.length + 1 >= battingTeam.squad.length
            ) {
                dispatch(updateSession());
                dispatch(completeSession());
                dispatch(setSessionOneCompletedStatsComp());
                dispatch(calculateRequiredRunRate());
            }
        }
    }, [bowlingTeam?.overDeci, battingTeam?.out]);

    // 2nd batting
    useEffect(() => {
        if (sessionOneCompleted && battingTeam && bowlingTeam) {
            // check if target is chased
            if (battingTeam.score >= sessionOne.batting.score) {
                console.log('target chased, you win')!;
                dispatch(setWinTeam(battingTeam.name));
                router.push('/game/gameover');
            }

            // check session is completed!
            if (bowlingTeam.overDeci >= over) {
                console.log('2s over is completed!');

                // check if target is chased
                targetChasedHandler();
            }

            // check all out
            if (battingTeam.out.length >= battingTeam.squad.length) {
                console.log('2s all out');

                // check if target is chased
                targetChasedHandler();
            }
            dispatch(calculateRequiredRunRate());
        }
    }, [bowlingTeam?.overDeci, bowlingTeam?.overFlt, battingTeam?.out]);

    return (
        <section className="w-full lg:w-[49%] h-[100px] lg:h-full rounded-lg bg-yellow-400">
            {!gameCompleted ? (
                <ul className="w-full h-full flex justify-evenly items-center">
                    {runs.map((run) => (
                        <li
                            key={run}
                            className="w-[50px] h-[50px] lg:w-[65px] lg:h-[65px] flex justify-center items-center p-2 font-bold rounded-full cursor-pointer shadow shadow-amber-400 bg-yellow-100 text-red-800 hover:bg-yellow-200 duration-200"
                            onClick={() => gameHandler(run)}
                        >
                            {run}
                        </li>
                    ))}
                </ul>
            ) : (
                <div>
                    <p>game is over</p>
                </div>
            )}
        </section>
    );
};

export default Runs;
