type SelectProfile = unknown;
type SelectUserRank = unknown;
export type CardColor = "amber" | "amethyst" | "emerald" | "ruby" | "sapphire" | "steel";
export type Zones = "hand" | "play" | "discard" | "inkwell" | "deck";
export type TableZones = Record<Zones, string[] | undefined>;
export type Meta = {
    exerted?: boolean | null;
    playedThisTurn?: boolean | null;
    damage?: number | null;
    shifter?: string | null;
    shifted?: string | null;
    revealed?: boolean | null;
    continuousEffects?: string[];
    location?: string | null;
    characters?: string[] | null;
    pendingChallenge?: string | null;
};
type TurnChallengeMeta = {
    damage: number;
    banished: boolean;
};
export type HowType = "play" | "discard" | "put" | "inkwell";
export type TableTurn = {
    cardsMoved?: Array<{
        card: string;
        from: Zones;
        to: Zones;
        how?: HowType;
    }>;
    challenges?: Array<{
        attacker: string;
        defender: string;
        meta: {
            attacker: TurnChallengeMeta;
            defender: TurnChallengeMeta;
        };
    }>;
    locations?: Record<string, Array<string>>;
    quests?: string[];
    abilities?: Array<{
        card: string;
        ability: string;
    }>;
    damages?: Record<string, boolean>;
};
export type Table = {
    zones: TableZones;
    lore: number;
    turn?: TableTurn;
};
export type TableCard = {
    instanceId: string;
    publicId: string;
    ownerId: string;
};
type PlayerId = string;
export type GamePlayer = SelectProfile & {
    id: string;
    instantId: string;
    name: string;
    tier: number;
    wins: number;
    deckVersionId: number;
    deckId: number;
    deckColors: CardColor[];
    ranks: SelectUserRank[];
    profileId: number;
};
export type Game = {
    id: string;
    name: string;
    visibility: "public" | "private";
    mode: "best-of-one" | "best-of-two" | "best-of-three";
    category: "private" | "casual" | "ranked" | "test" | "solo" | "007-BO3" | "007-BO1" | "007-EASTERN-BO1";
    cards: Record<string, TableCard>;
    lobbyId: string;
    matchesId: string[];
    winner?: string | null;
    rematchRequested?: string;
    rematchId?: string;
    cancellationRequested?: string;
    nakamaMatchId?: string;
    players: Record<PlayerId, GamePlayer>;
    createdAt: number;
    updatedAt: number;
    otp?: string;
    otd?: string;
    heartBeats: Record<string, number>;
};
export type PlayerRequest = {
    request: "UNDO_TURN" | "CONCEDE_GAME" | "MANUAL_MODE" | "CANCEL_GAME" | "UNDO_MOVE" | "ENABLE_CHAT";
    player: string;
    message: string;
};
export type ChallengeState = {
    attacker?: string;
    defender?: string;
};
export type PlayCardStateSerialised = {
    cardId: string | undefined;
    playerId: string | undefined;
    alternatePayment: boolean;
    totalCost: number;
    params?: {
        bodyguard?: boolean;
        hasShifted?: boolean;
        forFree?: boolean;
        bottomCardAfterPlaying?: boolean;
        exerted?: boolean;
        alternativeCosts?: string[];
    };
    costModifiers?: {
        additional: number;
        increases: number;
        reductions: number;
    };
};
export type MatchStart = {
    pendingAlteringHand: PlayerId[];
    startingPlayer: string;
    state: string;
    alteredCards: Record<PlayerId, number>;
};
export type SerializedStateMachines = {
    action?: Actions;
    phase?: Phases;
    step?: Steps;
    challengeState?: ChallengeState;
    playCardState?: PlayCardStateSerialised;
    matchStart?: MatchStart;
};
export type Phases = "BEGINNING" | "MAIN" | "END";
export type Actions = "CHALLENGE" | "PLAY_CARD" | "INK" | "QUEST" | "PASS" | "RESOLVE";
export type Steps = string;
export type GameEffect<Ability> = {
    instanceId: string;
    id: string;
    responder: string;
    ability: Ability;
};
export type Match<Ability, ContinuousEffect, FloatingTriggeredAbility> = {
    matchId: string;
    gameId: string;
    seed: string;
    firstPlayer?: string;
    choosingFirstPlayer: string;
    winner?: string | null;
    createdAt?: number;
} & {
    pendingRequests?: PlayerRequest[];
    pendingDrawStep?: string;
    moveCount: number;
    turnPlayer: string;
    priorityPlayer: string;
    priorityTimestamp: number;
    turnCount: number;
    metas: Record<string, Meta | undefined>;
    tables: Record<string, Table>;
    effects?: GameEffect<Ability>[];
    bag?: GameEffect<Ability>[];
    continuousEffects?: ContinuousEffect[];
    triggeredAbilities?: FloatingTriggeredAbility[];
    manualMode?: boolean;
    isPassingTurn?: boolean;
    stateMachines?: SerializedStateMachines;
};
export type InnerBoardState = {
    challenges: Array<{
        attacker: string;
        defender: string;
    }>;
    cardsPlayed: string[];
    quests: string[];
    deckCount: number;
    discardCount: number;
    handCount: number;
    inkCount: number;
    unusedInk: number;
    lore: number;
    cardsInPlay: string[];
};
export type BoardState = {
    turnCount: number;
    duration: number;
    movesCount: number;
    boards: Record<string, InnerBoardState>;
};
export {};
//# sourceMappingURL=index.d.ts.map