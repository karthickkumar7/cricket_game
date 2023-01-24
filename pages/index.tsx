import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { teams, overs } from '../data/team';
import {
    changeTeam,
    changeOpp,
    changeOver,
    setPlayerTeam,
    setOppTeam,
} from '../redux/reducers/gameReducer';
import { RootState } from '../redux/store';

const Home = () => {
    const { push } = useRouter();
    const { team, opp } = useSelector((s: RootState) => s.game);
    const dispatch = useDispatch();

    function teamSelectHandler() {
        const playerTeam = teams.find((t) => t.name === team);
        const oppTeam = teams.find((t) => t.name === opp);

        if (playerTeam) dispatch(setPlayerTeam(playerTeam));
        if (oppTeam) dispatch(setOppTeam(oppTeam));

        push('/game');
    }

    return (
        <div className="w-screen h-screen bg-slate-900">
            <section className="w-full h-1/2 flex justify-center items-center">
                <div className="w-[250px] lg:w-[450px] h-[250px] lg:h-[300px] relative">
                    <Image
                        src={`/images/cric_banner.jpg`}
                        alt="banner"
                        className="w-full h-full rounded-3xl object-cover z-10"
                        width={200}
                        height={150}
                    />
                    <div className="inset-0 absolute bg-gradient-to-r from-black to-slate-800 opacity-20"></div>
                </div>
            </section>
            <section className="w-full h-1/2 flex flex-col items-center space-y-3 text-lg font-bold">
                <div className="lg:w-[400px] space-y-2 lg:flex justify-between items-center lg:space-x-4">
                    <h2 className="text-xl text-white capitalize">your team</h2>
                    <select
                        name="team"
                        id="team"
                        className="w-[250px] h-[40px] p-2 uppercase rounded-lg cursor-pointer bg-blue-600 text-white outline-none hover:bg-blue-500 duration-200"
                        defaultValue={'india'}
                        onChange={(e) => dispatch(changeTeam(e.target.value))}
                    >
                        {teams.map((team) => (
                            <option key={team.id} value={team.name}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="lg:w-[400px] space-y-2 lg:flex justify-between items-center lg:space-x-4">
                    <h2 className="text-xl text-white capitalize">com team</h2>
                    <select
                        name="team"
                        id="team"
                        className="w-[250px] h-[40px] p-2 uppercase rounded-lg text-lg cursor-pointer bg-red-600 text-white outline-none hover:bg-red-500 duration-200"
                        defaultValue={'pakistan'}
                        onChange={(e) => dispatch(changeOpp(e.target.value))}
                    >
                        {teams.map((team) => (
                            <option key={team.id} value={team.name}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="lg:w-[400px] space-y-2 lg:flex justify-between items-center lg:space-x-4">
                    <h2 className="text-xl text-white capitalize">overs</h2>
                    <select
                        name="team"
                        id="team"
                        className="w-[250px] h-[40px] p-2 uppercase rounded-lg text-lg font-bold cursor-pointer bg-amber-400 text-black hover:bg-amber-300 outline-none duration-200"
                        defaultValue={5}
                        onChange={(e) =>
                            dispatch(changeOver(Number(e.target.value)))
                        }
                    >
                        {overs.map((o) => (
                            <option
                                key={o}
                                value={o}
                                className="font-bold text-lg"
                            >
                                {o}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="py-4">
                    <button
                        className="w-[250px] lg:w-[400px] px-4 py-2 rounded-lg uppercase font-bold bg-purple-600 text-white hover:bg-purple-500 duration-200"
                        onClick={() => teamSelectHandler()}
                    >
                        play
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
