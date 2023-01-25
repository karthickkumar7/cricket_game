import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Table = () => {
    const [showBowlingTable, setShowBowlingTable] = useState(false);
    const { battingTeam, bowlingTeam } = useSelector((s: RootState) => s.game);

    function isPlaying(playerId: string): boolean {
        return battingTeam?.onStand === playerId ? true : false;
    }

    function isBowling(playerId: string): boolean {
        return bowlingTeam?.currentBowler === playerId ? true : false;
    }

    return (
        <section
            className={`${
                showBowlingTable ? 'bg-purple-500' : 'bg-slate-300'
            } w-full h-full p-2 rounded-lg relative`}
        >
            <table className="w-full">
                {showBowlingTable ? (
                    // bowling table
                    <>
                        <thead className="">
                            <tr className="py-2 px-1 flex rounded-lg justify-between uppercase bg-purple-900 text-purple-100">
                                <th>name</th>
                                <th>ovr</th>
                                <th>wkts</th>
                                <th>runs</th>
                                <th>economy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bowlingTeam &&
                                bowlingTeam.lineup.map((p) => (
                                    <tr
                                        key={p.id}
                                        className={`${
                                            isBowling(p.id)
                                                ? 'bg-purple-300 text-black'
                                                : 'text-white'
                                        } p-1 rounded-lg flex justify-between `}
                                    >
                                        <td className="capitalize">{p.name}</td>
                                        <td>{p.overs}</td>
                                        <td>{p.wickets}</td>
                                        <td>{p.runs}</td>
                                        <td>{p.economy.toPrecision(3)}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </>
                ) : (
                    // batting table
                    <>
                        <thead className="">
                            <tr className="py-2 px-1 rounded-lg flex justify-between uppercase text-white bg-slate-800">
                                <th>name</th>
                                <th>runs</th>
                                <th>six</th>
                                <th>four</th>
                                <th>wicket</th>
                            </tr>
                        </thead>
                        <tbody>
                            {battingTeam &&
                                battingTeam.squad.map((p) => (
                                    <tr
                                        key={p.id}
                                        className={`${
                                            isPlaying(p.id)
                                                ? 'bg-blue-300 text-black'
                                                : 'text-black'
                                        } p-1 rounded-lg flex justify-between `}
                                    >
                                        <td className="capitalize">{p.name}</td>
                                        <td>{p.runs}</td>
                                        <td>{p.six}</td>
                                        <td>{p.four}</td>
                                        {p.wicket ? (
                                            <td className="font-semibold">
                                                {p.wicket}
                                            </td>
                                        ) : (
                                            <td>{'not out'}</td>
                                        )}
                                    </tr>
                                ))}
                        </tbody>
                    </>
                )}
            </table>
            <div
                className={`${
                    !showBowlingTable
                        ? 'bg-slate-800 text-white'
                        : 'bg-white text-black'
                } absolute bottom-2 right-2 w-[60px] h-[30px] rounded-full text-sm flex justify-center items-center cursor-pointer`}
                onClick={() => setShowBowlingTable((pv) => !pv)}
            >
                next
            </div>
        </section>
    );
};

export default Table;
