import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSessionOneCompletedStatsComp } from '../redux/reducers/gameReducer';
import { RootState } from '../redux/store';

const InterTable = () => {
    const { sessionOne, requiredRunRate } = useSelector(
        (s: RootState) => s.game
    );
    const dispatch = useDispatch();

    function nextSessionHandler() {
        dispatch(setSessionOneCompletedStatsComp());
    }

    return (
        <div className="w-full h-full flex flex-col items-center">
            <section className="w-full lg:w-[40%] lg:space-y-4 h-[80%] flex flex-col items-center">
                <h2 className="text-xl font-bold uppercase mb-2">
                    {sessionOne?.batting.name}
                </h2>
                <table className="w-[90%] min-h-[200px] p-2">
                    <thead>
                        <tr className="pb-2 flex justify-between border-b text-slate-300 uppercase">
                            <th>name</th>
                            <th>runs</th>
                            <th>four</th>
                            <th>six</th>
                            <th>wicket</th>
                        </tr>
                    </thead>
                    <tbody className="p-1">
                        {sessionOne.batting.squad &&
                            sessionOne.batting.squad.map((player) => (
                                <tr
                                    key={player.id}
                                    className="flex justify-between text-sm"
                                >
                                    <td className="capitalize min-w-[70px]">
                                        {player.name}
                                    </td>
                                    <td className="">{player.runs}</td>
                                    <td className="">{player.four}</td>
                                    <td className="">{player.six}</td>
                                    <td className="">
                                        {player.wicket || 'not out'}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* bowling table */}
                <h2 className="text-xl font-bold uppercase mb-2">
                    {sessionOne.bowling?.name}
                </h2>
                <table className="w-[90%] min-h-[200px] p-2">
                    <thead>
                        <tr className="pb-2 flex justify-between border-b text-slate-300 uppercase">
                            <th>name</th>
                            <th>overs</th>
                            <th>wickets</th>
                            <th>runs</th>
                            <th>economy</th>
                        </tr>
                    </thead>
                    <tbody className="p-1">
                        {sessionOne.bowling.lineup &&
                            sessionOne.bowling.lineup.map((player) => (
                                <tr
                                    key={player.id}
                                    className="flex justify-between text-sm"
                                >
                                    <td className="capitalize min-w-[70px]">
                                        {player.name}
                                    </td>
                                    <td>{player.overs}</td>
                                    <td>{player.wickets}</td>
                                    <td>{player.runs}</td>
                                    <td>{player.economy.toPrecision(3)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </section>
            <section className="my-2">
                <h4 className="text-xl uppercase font-semibold">
                    target - {sessionOne.batting && sessionOne.batting.score}
                </h4>
                <h4 className="text-xl uppercase font-semibold">
                    required runrate - {requiredRunRate?.toPrecision(3)}
                </h4>
            </section>
            <button
                className="w-[100px] h-[60px] my-2 px-x py-2 rounded-lg text-lg capitalize font-semibold text-white bg-green-500"
                onClick={nextSessionHandler}
            >
                play next
            </button>
        </div>
    );
};

export default InterTable;
