import type { GundamitoCard } from "./cards/definitions/cardTypes";

export type { Effect } from "./abilities/effects/types";
export type { Ability } from "./abilities/types";
export type { GundamModel } from "./cards/gundam-card-model";

export type PlayerState = {
  id: string;
  name: string;
  turnHistory: string[];
  zones: {
    deck: string[];
    resourceDeck: string[];
    resourceArea: string[];
    battleArea: string[];
    shieldBase: string[];
    shieldSection: string[];
    removalArea: string[];
    hand: string[];
    trash: string[];
    sideboard: string[];
  };
};

export type GundamGameState = {
  gameId?: string;
  matchId?: string;
  numPlayers?: number;
  winner?: string;
  choosingFirstPlayer?: string;
  firstPlayer?: string;
  createdAt?: number;
  randomSeed?: string;
  manualMode?: boolean;
  turn?: string;
  priority?: string;
  phase?: GamePhase;
  players?: Record<string, PlayerState>;
  actionHistory?: string[];
};

export type GundamCardDefinition = GundamitoCard;

export type GamePhase =
  | "startPhase"
  | "drawPhase"
  | "resourcePhase"
  | "mainPhase"
  | "endPhase";

export type GameAction =
  | "deployUnit"
  | "deployBase"
  | "pairPilot"
  | "playCommand"
  | "activateMain"
  | "attackWithUnit"
  | "activateAction"
  | "playActionCommand"
  | "pass"
  | "concede";

export type ZoneType =
  | "deck"
  | "resourceDeck"
  | "resourceArea"
  | "battleArea"
  | "shieldBase"
  | "shieldSection"
  | "removalArea"
  | "hand"
  | "trash"
  | "sideboard";

export type CardType = "Unit" | "Pilot" | "Command" | "Base" | "Resource";

export type CardColor = "blue" | "green" | "red" | "white";

export type Duration =
  | { type: "endOfTurn" }
  | { type: "endOfBattle" }
  | { type: "untilLeaves" }
  | { type: "turns"; count: number }
  | { type: "permanent" };

export type Target = {
  type: "card" | "player";
  id: string;
};

export type TriggerTiming =
  | "onDeploy"
  | "onAttack"
  | "onDestroy"
  | "onDamage"
  | "onPair"
  | "duringPair"
  | "startOfTurn"
  | "endOfTurn";

export type ActionType =
  | "deployUnit"
  | "deployBase"
  | "pairPilot"
  | "playCommand"
  | "activateMain"
  | "attackWithUnit"
  | "activateAction"
  | "playActionCommand"
  | "pass"
  | "concede"
  | "turnStart"
  | "turnEnd"
  | "phaseStep"
  | "phaseTransition"
  | "draw"
  | "addResource"
  | "alterHand";

export type PlayerId = string;
export type InstanceId = string;
export type PublicId = string;
export type GameCards = Record<PlayerId, Record<InstanceId, PublicId>>;
