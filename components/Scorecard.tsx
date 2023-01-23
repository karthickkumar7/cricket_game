import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Lineup, Squad } from '../typeDefs/types';

const Scorecard = () => {
    const [currentBowler, setCurrentBowler] = useState<Lineup>();
    const { battingTeam, bowlingTeam, oppRun, over } = useSelector(
        (s: RootState) => s.game
    );

    useEffect(() => {
        if (bowlingTeam?.currentBowler) {
            setCurrentBowler(
                bowlingTeam?.lineup.find(
                    (p) => p.id === bowlingTeam.currentBowler
                )
            );
        }
    }, [bowlingTeam]);

    return (
        <section className="w-[85%] lg:w-[40%] h-[100px] px-4 py-2 rounded-lg flex justify-between items-center bg-blue-600">
            <div className="w-1/2 h-full">
                {/* batting team name */}
                <h4 className="uppercase font-bold">{battingTeam?.name}</h4>
                {/* runs / wickets */}
                <p className="text-2xl font-semibold">
                    {battingTeam?.score} / {battingTeam?.out.length}
                </p>
                {/* overs */}
                <p className="text-sm text-blue-100">
                    {bowlingTeam?.overDeci}.{bowlingTeam?.overFlt} / {over}
                </p>
            </div>
            <div className="w-1/2 h-full space-y-1 flex flex-col justify-center items-center">
                <p className="uppercase text-sm">{currentBowler?.name}</p>
                <div className="w-[60px] h-[60px] flex justify-center items-center rounded-full text-3xl bg-blue-800">
                    {oppRun}
                </div>
            </div>
        </section>
    );
};

export default Scorecard;
