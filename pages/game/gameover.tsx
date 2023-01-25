import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import EndGameBattingTable from '../../components/EndGameBattingTable';
import { playAgain } from '../../redux/reducers/gameReducer';
import { RootState } from '../../redux/store';

const GameOver = () => {
    const [showBattingTable, setShowBattingTable] = useState(true);
    // const [showOppTable, setShowOppTable] = useState(false);
    const [msg, setMsg] = useState('');
    const { battingTeam, bowlingTeam, winTeam, over, sessionOne } = useSelector(
        (s: RootState) => s.game
    );
    const dispatch = useDispatch();
    const router = useRouter();

    const timeOutRef: any = useRef();

    function swapBatBowlTableHandler() {
        setShowBattingTable((pv) => !pv);
    }

    function playAgainHandler() {
        dispatch(playAgain());
        timeOutRef.current = setTimeout(() => {
            router.push('/game');
        }, 500);
    }

    useEffect(() => {
        if (winTeam === battingTeam?.name) {
            if (battingTeam && bowlingTeam)
                if (battingTeam.squad.length - battingTeam.out.length) {
                    // check if wickets remaining
                    setMsg(
                        `${battingTeam?.name} won by ${
                            battingTeam.squad.length - battingTeam.out.length
                        } wickets`
                    );
                } else {
                    setMsg(
                        `${battingTeam?.name} won by ${
                            over * 6 -
                            (bowlingTeam.overDeci * 6 - bowlingTeam.overFlt)
                        } balls`
                    );
                }
        }

        if (winTeam === bowlingTeam?.name) {
            if (battingTeam && bowlingTeam)
                if (
                    over * 6 -
                    (bowlingTeam.overDeci * 6 - bowlingTeam.overFlt)
                ) {
                    // check if ball remaining
                    setMsg(
                        `${bowlingTeam?.name} won ${
                            over * 6 -
                            (bowlingTeam.overDeci * 6 - bowlingTeam.overFlt)
                        } balls`
                    );
                } else {
                    setMsg(
                        `${bowlingTeam?.name} won ${
                            sessionOne.batting.score - battingTeam?.score
                        } balls`
                    );
                }
        }

        return () => {
            clearTimeout(timeOutRef.current);
        };
    }, []);

    return (
        <div className="w-screen h-screen lg:py-4 flex flex-col items-center bg-slate-900 text-white">
            <section className="w-full lg:w-[40%] h-[8%] flex justify-center items-center uppercase text-xl font-semibold lg:rounded-lg bg-sky-800">
                <h2>{msg}</h2>
            </section>
            {/* table section */}
            <section className="w-full lg:w-[40%] h-[72%] flex flex-col lg:flex-row lg:items-center">
                {/* table */}
                <div className="w-full lg:w-[80%] h-[75%] lg:h-[50%] flex justify-center items-center lg:items-stretch">
                    <EndGameBattingTable />
                </div>
            </section>

            <section className="w-full lg:w-[40%] h-[20%] flex justify-evenly items-center">
                <button
                    className="w-[40%] h-[60px] rounded-lg font-semibold uppercase bg-blue-600"
                    onClick={playAgainHandler}
                >
                    play again
                </button>
                <button
                    className="w-[40%] h-[60px] rounded-lg font-semibold uppercase bg-red-600"
                    onClick={() => (window.location.pathname = '/')}
                >
                    home
                </button>
            </section>
        </div>
    );
};

export default GameOver;
