import { createSlice } from '@reduxjs/toolkit';
import { Team, BattingTeam, BowlingTeam, Session } from '../../typeDefs/types';

interface InitialState {
    team: string;
    opp: string;
    over: number;
    toss: string;
    oppChoseToss: string;
    playerChose: string;
    playerTeam: Team | null;
    oppTeam: Team | null;
    battingTeam: BattingTeam | null;
    bowlingTeam: BowlingTeam | null;
    oppRun: number;
    sessionOne: Session;
    sessionOneCompleted: boolean;
    sessionOneCompletedStatComp: boolean;
    gameCompleted: boolean;
    winTeam: string;

    currentRunRate: number;
    requiredRunRate: number;
    projectedRuns: number;

    showInterModal: boolean;
}

const initialState: InitialState = {
    team: 'india',
    opp: 'pakistan',
    over: 5,
    toss: '',
    oppChoseToss: '',
    playerChose: '',
    playerTeam: null,
    oppTeam: null,
    battingTeam: null,
    bowlingTeam: null,
    oppRun: 0,
    sessionOne: {
        batting: {
            name: '',
            score: 0,
            squad: null,
        },
        bowling: {
            name: '',
            lineup: null,
            requiredRunrate: 0,
        },
    },
    sessionOneCompleted: false,
    sessionOneCompletedStatComp: false,
    gameCompleted: false,
    winTeam: '',
    currentRunRate: 0,
    requiredRunRate: 0,
    projectedRuns: 0,
    showInterModal: false,
};

const gameSlice = createSlice({
    name: 'game',

    initialState,

    reducers: {
        changeTeam: (state, { payload }) => {
            state.team = payload;
        },
        changeOpp: (state, { payload }) => {
            state.opp = payload;
        },
        changeOver: (state, { payload }) => {
            state.over = payload;
        },
        changeToss: (state, { payload }) => {
            state.toss = payload;
        },
        changeOppChoseToss: (state, { payload }) => {
            state.oppChoseToss = payload;
        },
        changePlayerChose: (state, { payload }) => {
            state.playerChose = payload;
        },

        setWinTeam: (state, { payload }) => {
            state.winTeam = payload;
        },

        setPlayerTeam: (state, { payload }) => {
            state.playerTeam = payload;
        },

        setOppTeam: (state, { payload }) => {
            state.oppTeam = payload;
        },

        setBattingTeam: (state, { payload }) => {
            state.battingTeam = payload;
        },

        setBowlingTeam: (state, { payload }) => {
            state.bowlingTeam = payload;
        },

        swapBatsmen: (state, { payload }) => {
            // @ts-ignore
            state.battingTeam = {
                ...state.battingTeam,
                onStand: payload.offStand,
                offStand: payload.onStand,
            };
        },

        updateRuns: (state, { payload }) => {
            // @ts-ignore
            state.battingTeam = {
                ...state.battingTeam,
                squad: payload,
            };
        },

        setOppRun: (state, { payload }) => {
            state.oppRun = payload;
        },

        updateOver: (state, { payload }) => {
            // @ts-ignore
            state.bowlingTeam = {
                ...state.bowlingTeam,
                overDeci: state.bowlingTeam?.overDeci + payload.deci,
                overFlt: state.bowlingTeam?.overFlt + payload.flt,
            };
        },

        resetFltOver: (state) => {
            // @ts-ignore
            state.bowlingTeam = {
                ...state.bowlingTeam,
                overFlt: 0,
            };
        },

        updateBattingScore: (state, { payload }) => {
            // @ts-ignore
            state.battingTeam = {
                ...state.battingTeam,
                score: payload,
            };
        },

        changeOutPlayer: (state, { payload }) => {
            // @ts-ignore
            state.battingTeam = {
                ...state.battingTeam,
                onStand: payload.onStand,
                remaining: payload.remaining,
                out: payload.out,
            };
        },

        overFinish: (state, { payload }) => {
            // @ts-ignore
            state.bowlingTeam = {
                ...state.bowlingTeam,
                currentBowler: payload.currentBowler,
                prevBowler: payload.prevBowler,
            };

            // exchange bat
            let temp = state.battingTeam?.onStand;

            // @ts-ignore
            state.battingTeam = {
                ...state.battingTeam,
                onStand: state.battingTeam?.offStand || '',
                offStand: temp || '',
            };
        },

        completeSession: (state) => {
            state.sessionOneCompleted = true;

            // swap bat and bowl team
            state.playerChose = state.playerChose === 'bat' ? 'ball' : 'bat';
        },

        updateSession: (state) => {
            // save the first innings
            // @ts-ignore
            state.sessionOne = {
                ...state.sessionOne,
                batting: {
                    name: state.battingTeam?.name || '',
                    score: state.battingTeam?.score || 0,
                    // @ts-ignore
                    squad: state.battingTeam?.squad,
                },
                bowling: {
                    name: state.bowlingTeam?.name || '',
                    // @ts-ignore
                    lineup: state.bowlingTeam?.lineup,
                },
            };
        },

        setGameCompleted: (state) => {
            state.gameCompleted = true;
        },

        setSessionOneCompletedStatsComp: (state) => {
            state.sessionOneCompletedStatComp =
                !state.sessionOneCompletedStatComp;
        },

        increaseCurrentBowlerOverAndEconomy: (state, { payload }) => {
            // @ts-ignore
            state.bowlingTeam = {
                ...state.bowlingTeam,
                // @ts-ignore
                lineup: state.bowlingTeam?.lineup.map((p) => {
                    if (p.id === payload.currentBowler) {
                        return {
                            ...p,
                            overs: p.overs + 1,
                            economy: p.runs / ((p.overs + 1) * 6),
                        };
                    }
                    return p;
                }),
            };
        },

        addWicketBowlerName: (state, { payload }) => {
            state.battingTeam = {
                ...state.battingTeam,
                // @ts-ignore
                squad: state.battingTeam?.squad.map((p) => {
                    if (p.id === payload.currentBatsman) {
                        return {
                            ...p,
                            wicket: state.bowlingTeam?.lineup.find(
                                (p) => p.id === payload.currentBowler
                            )?.name,
                        };
                    }
                    return p;
                }),
            };
        },

        increaseBowlerWicket: (state, { payload }) => {
            state.bowlingTeam = {
                ...state.bowlingTeam,
                // @ts-ignore
                lineup: state.bowlingTeam?.lineup.map((p) => {
                    if (p.id === payload.currentBowler) {
                        return {
                            ...p,
                            wickets: p.wickets + 1,
                        };
                    }
                    return p;
                }),
            };
        },

        updateCurrentBowlerExpense: (state, { payload }) => {
            state.bowlingTeam = {
                ...state.bowlingTeam,
                // @ts-ignore
                lineup: state.bowlingTeam?.lineup.map((p) => {
                    if (p.id === payload.currentBowler) {
                        return {
                            ...p,
                            runs: p.runs + payload.runs,
                        };
                    }
                    return p;
                }),
            };
        },

        playAgain: (state) => {
            state.toss = '';
            state.oppChoseToss = '';
            state.playerChose = '';
            state.battingTeam = null;
            state.bowlingTeam = null;
            state.oppRun = 0;
            state.sessionOne = {
                batting: {
                    name: '',
                    score: 0,
                    squad: null,
                },
                bowling: {
                    name: '',
                    lineup: null,
                    requiredRunrate: 0,
                },
            };
            state.sessionOneCompleted = false;
            state.sessionOneCompletedStatComp = false;
            state.gameCompleted = false;
            state.winTeam = '';
            state.currentRunRate = 0;
            state.requiredRunRate = 0;
            state.projectedRuns = 0;
        },

        calculateCurrentRunRate: (state) => {
            if (state.bowlingTeam)
                state.currentRunRate =
                    state.sessionOne?.batting.score /
                    (state.bowlingTeam?.overDeci + state.bowlingTeam?.overFlt);
        },

        calculateRequiredRunRate: (state) => {
            state.requiredRunRate =
                (state.sessionOne?.batting.score / (state.over * 6)) * 6;
        },

        calculateProjectedScore: (state) => {
            if (state.battingTeam && state.bowlingTeam)
                state.projectedRuns =
                    (state.battingTeam?.score * (state.over * 6)) /
                    (state.bowlingTeam?.overDeci * 6 +
                        state.bowlingTeam.overFlt);
        },

        setShowInterModal: (state, { payload }) => {
            state.showInterModal = payload;
        },
    },
});

export const {
    changeOpp,
    changeOver,
    changeTeam,
    changeToss,
    changeOppChoseToss,
    setWinTeam,
    changePlayerChose,
    setPlayerTeam,
    setOppTeam,
    setBattingTeam,
    setBowlingTeam,
    swapBatsmen,
    updateRuns,
    setOppRun,
    updateOver,
    resetFltOver,
    updateBattingScore,
    changeOutPlayer,
    overFinish,
    completeSession,
    updateSession,
    setGameCompleted,
    setSessionOneCompletedStatsComp,
    increaseCurrentBowlerOverAndEconomy,
    addWicketBowlerName,
    increaseBowlerWicket,
    updateCurrentBowlerExpense,
    playAgain,
    calculateCurrentRunRate,
    calculateRequiredRunRate,
    calculateProjectedScore,
    setShowInterModal,
} = gameSlice.actions;

export default gameSlice.reducer;
