declare module "@tcg/op-cards" {
  export interface OnePiecePrinting {
    id: string;
    setCode: string;
  }

  export interface OnePieceCard {
    printings: readonly OnePiecePrinting[];
  }

  export function getCard(cardId: string): OnePieceCard;
  export function hasCard(cardId: string): boolean;
}

declare module "@tcg/op-engine" {
  export const SOUTH: "south";

  export type MatchSeat = "north" | "south";
  export type Viewer = MatchSeat | "judge" | "spectator";
  export type MatchPhase = "setup" | "refresh" | "draw" | "don" | "main" | "end" | "finished";
  export type CardZone = "leader" | "deck" | "hand" | "life" | "character" | "stage" | "trash";
  export type FixtureCardEntry = string | FixtureCardState;

  export interface FixtureCardState {
    cardId: string;
    rested?: boolean;
    attachedDon?: number;
    playedOnTurn?: number | null;
    faceUp?: boolean;
    publicKnowledge?: boolean;
  }

  export interface PlayerFixture {
    leaderCardId?: string;
    hand?: number | FixtureCardEntry[];
    deck?: number | FixtureCardEntry[];
    life?: number | FixtureCardEntry[];
    character?: FixtureCardEntry[];
    stage?: FixtureCardEntry | null;
    trash?: number | FixtureCardEntry[];
    activeDon?: number;
    restedDon?: number;
    donDeckCount?: number;
    playerName?: string;
  }

  export interface TestMatchOptions {
    seed?: string | number;
    firstPlayer?: MatchSeat;
    activeSeat?: MatchSeat;
    skipSetup?: boolean;
    fillerCardId?: string;
    maxCharacterSlots?: number;
  }

  export interface MatchState {
    status: string;
    activeSeat: MatchSeat;
    turnNumber: number;
    phase: MatchPhase;
    players: Record<MatchSeat, { leaderInstanceId: string }>;
    cards: Record<string, { attachedDon: number } | undefined>;
    setup: {
      started: boolean;
    };
    eventSequence: number;
    logSequence: number;
  }

  export interface ProjectedCard {
    instanceId: string | null;
    cardId: string | null;
    name: string | null;
    owner: MatchSeat;
    zone: CardZone;
    rested: boolean;
    attachedDon: number;
    power: number | null;
    cost: number | null;
    hidden: boolean;
  }

  export interface ProjectedPlayerState {
    seat: MatchSeat;
    playerName: string;
    leader: ProjectedCard;
    handCount: number;
    deckCount: number;
    lifeCount: number;
    trash: ProjectedCard[];
    stage: ProjectedCard | null;
    characters: Array<ProjectedCard | null>;
    hand: ProjectedCard[];
    life: ProjectedCard[];
    deckTop: ProjectedCard | null;
    activeDon: number;
    restedDon: number;
    donDeckCount: number;
  }

  export interface ProjectedLogEntry {
    id: string;
    turn: number;
    phase: MatchPhase;
    actor: MatchSeat | "judge";
    sourceInstanceId: string | null;
    targetIds: string[];
    message: string;
  }

  export interface PlayerView {
    activeSeat: MatchSeat;
    turnNumber: number;
    phase: MatchPhase;
    players: Record<MatchSeat, ProjectedPlayerState>;
    logs: ProjectedLogEntry[];
  }

  export function createTestMatchState(
    southFixture?: PlayerFixture,
    northFixture?: PlayerFixture,
    options?: TestMatchOptions,
  ): MatchState;

  export function projectStateForSeat(state: MatchState, viewer: Viewer): PlayerView;
}
