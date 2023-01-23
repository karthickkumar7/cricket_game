import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../../redux/store';
import {
    changeOpp,
    changeOppChoseToss,
    changePlayerChose,
    changeToss,
} from '../../redux/reducers/gameReducer';

const Toss = () => {
    const { push } = useRouter();
    const timerRef = useRef<any>(null);
    const { toss, oppChoseToss } = useSelector((s: RootState) => s.game);
    const dispatch = useDispatch();

    function callTosshandler(call: string) {
        const tossResults = ['h', 't'][Math.floor(Math.random() * 2)];

        if (tossResults === call) {
            // set player win
            dispatch(changeToss('win'));
        } else {
            // opp win toss handler
            dispatch(changeToss('loss'));

            const comChoose = ['bat', 'ball'][Math.floor(Math.random() * 2)];

            if (comChoose === 'bat') {
                dispatch(changeOppChoseToss('bat'));
                dispatch(changePlayerChose('ball'));
            } else {
                dispatch(changeOppChoseToss('ball'));
                dispatch(changePlayerChose('bat'));
            }

            timerRef.current = setTimeout(() => {
                push('/game/play');
            }, 2000);
        }
    }

    // choose b/w bat and bowl handler
    function callBathandler(call: string) {
        if (call === 'bat') {
            dispatch(changePlayerChose('bat'));
            dispatch(changeOppChoseToss('ball'));
        } else {
            dispatch(changePlayerChose('ball'));
            dispatch(changeOppChoseToss('bat'));
        }
        push('/game/play');
    }

    useEffect(() => {
        return () => {
            clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-slate-900 text-white">
            {/* toss call */}
            {toss === '' && (
                <div className="w-full h-1/2 lg:w-1/3 flex flex-col items-center space-y-4">
                    <h1 className="text-3xl my-4 font-semibold uppercase">
                        call for toss
                    </h1>
                    <div className="w-full flex justify-evenly lg:text-xl">
                        <div
                            className="h-[100px] w-[100px] lg:h-[200px] lg:w-[200px] flex justify-center items-center bg-yellow-300 text-black rounded-full uppercase font-bold cursor-pointer hover:bg-yellow-400 duration-200"
                            onClick={() => callTosshandler('h')}
                        >
                            heads
                        </div>
                        <div
                            className="h-[100px] w-[100px] lg:h-[200px] lg:w-[200px] flex justify-center items-center bg-red-300 text-black rounded-full uppercase font-bold cursor-pointer hover:bg-red-400 duration-200"
                            onClick={() => callTosshandler('t')}
                        >
                            tails
                        </div>
                    </div>
                </div>
            )}

            {/* win condition */}
            {toss === 'win' && (
                <div className="w-full h-1/2 lg:w-1/3 flex flex-col items-center space-y-4">
                    <h1 className="text-3xl my-4 font-semibold capitalize">
                        you won the toss!
                    </h1>
                    <div className="w-full flex justify-evenly">
                        <div
                            className="cursor-pointer hover:opacity-80"
                            onClick={() => callBathandler('bat')}
                        >
                            <Image
                                src="/images/bat.png"
                                alt="bat"
                                width={100}
                                height={100}
                                className="h-[150px] w-[100px] flex justify-center items-center rounded-full object-contain"
                            />
                        </div>
                        <div
                            className="cursor-pointer hover:opacity-80"
                            onClick={() => callBathandler('ball')}
                        >
                            <Image
                                src="/images/ball.png"
                                alt="bat"
                                width={100}
                                height={100}
                                className="h-[150px] w-[100px] flex justify-center items-center rounded-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* loss condition */}
            {toss === 'loss' && (
                <div className="w-full h-1/2 lg:w-1/3 flex flex-col items-center space-y-4">
                    <h1 className="text-3xl my-4 font-semibold capitalize">
                        you lost the toss!
                    </h1>
                    <h1 className="text-2xl my-4 font-semibold capitalize">
                        opp chose to {oppChoseToss}
                    </h1>
                </div>
            )}
        </div>
    );
};

export default Toss;
