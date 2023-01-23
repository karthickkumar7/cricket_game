import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Squad } from '../typeDefs/types';
import {} from '../redux/reducers/gameReducer';

const Runrate = () => {
    const [onStand, setOnStand] = useState<Squad>();
    const [offStand, setOffStand] = useState<Squad>();

    const {
        battingTeam,
        sessionOneCompleted,
        requiredRunRate,
        projectedRuns,
        currentRunRate,
    } = useSelector((s: RootState) => s.game);

    // extract runs of onstand and offstand players
    useEffect(() => {
        if (battingTeam?.onStand && battingTeam.offStand) {
            setOnStand(
                battingTeam?.squad.find((p) => p.id === battingTeam.onStand)
            );
            setOffStand(
                battingTeam?.squad.find((p) => p.id === battingTeam.offStand)
            );
        }
    }, [battingTeam?.onStand, battingTeam?.offStand, battingTeam?.squad]);

    return (
        <section className="w-full lg:w-[49%] h-[100px] lg:h-full lg:flex flex justify-center items-center p-4 rounded-lg bg-teal-600">
            <div className="w-1/2 font-bold uppercase space-y-2">
                <p className="lg:text-xl">
                    {onStand?.name}* {onStand?.runs}
                </p>
                <p className="lg:text-xl">
                    {offStand?.name} {offStand?.runs}
                </p>
            </div>
            <div className="w-1/2 space-y-2 uppercase">
                <p className="lg:text-xl font-semibold">
                    current rt : {currentRunRate.toPrecision(3)}
                </p>
                {/* session 1 projected score */}
                {!sessionOneCompleted && (
                    <p className="lg:text-xl font-semibold">
                        projected : {projectedRuns.toPrecision(3)}
                    </p>
                )}

                {/* session 2 required runrate */}
                {sessionOneCompleted && (
                    <p className="lg:text-xl font-semibold">
                        required rt : {requiredRunRate.toPrecision(3)}
                    </p>
                )}
            </div>
        </section>
    );
};

export default Runrate;
