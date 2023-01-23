export interface Player {
    id: string;
    name: string;
}

export interface Team {
    id: string;
    name: string;
    players: Player[];
}

export interface Squad {
    id: string;
    name: string;
    runs: number;
    six: number;
    four: number;
    wicket: string;
}

export interface Lineup {
    id: string;
    name: string;
    wickets: number;
    economy: number;
    overs: number;
    runs: number;
}

export interface BattingTeam {
    name: string;
    squad: Squad[];
    onStand: string;
    offStand: string;
    out: string[];
    remaining: string[];
    score: number;
}

export interface BowlingTeam {
    name: string;
    currentBowler: string;
    prevBowler: string;
    lineup: Lineup[];
    remainingBowler: string[];
    overDeci: number;
    overFlt: number;
}

export interface Session {
    batting: {
        name: string;
        squad: Squad[] | null;
        score: number;
    };
    bowling: {
        name: string;
        lineup: Lineup[] | null;
        requiredRunrate: number;
    };
}
