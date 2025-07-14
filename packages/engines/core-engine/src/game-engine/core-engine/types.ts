import type { PhaseMap } from "./game/structure/phase";
import type { TurnConfig } from "./game/structure/turn";
import type { FnContext, MoveMap, SegmentMap } from "./game-configuration";

export type PlayerID = string;

export interface Game<G = any, SetupData = any> {
  name?: string;
  minPlayers?: number;
  maxPlayers?: number;

  setup?: (context: any, setupData?: SetupData) => G;

  moves?: MoveMap<G>;
  segments?: SegmentMap<G>;
  phases?: PhaseMap<G>;
  turn?: TurnConfig<G>;

  events?: {
    endGame?: boolean;
    endPhase?: boolean;
    endTurn?: boolean;
    setPhase?: boolean;
    endStage?: boolean;
    setStage?: boolean;
    pass?: boolean;
    passTurn?: boolean;
    passPriority?: boolean;
    setActivePlayers?: boolean;
    setPriorityPlayer?: boolean;
  };

  endIf?: (context: FnContext<G>) => any;
  onEnd?: (context: FnContext<G>) => undefined | G;
}

export type PlayerId = string;
export type InstanceId = string;
export type PublicId = string;
export type GameCards = Record<PlayerId, Record<InstanceId, PublicId>>;
