import type { FnContext } from "../../game-configuration";
import type { PlayerID } from "../../types";
import type { StageMap } from "./step-types";

export interface TurnOrderConfig<G = unknown> {
  first: (context: FnContext<G>) => number;
  next: (context: FnContext<G>) => number | undefined;
  playOrder?: (context: FnContext<G>) => PlayerID[];
}

export interface TurnConfig<G = unknown> {
  order?: TurnOrderConfig<G>;
  minMoves?: number;
  maxMoves?: number;

  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
  endIf?: (context: FnContext<G>) => boolean | undefined | { next: PlayerID };
  onMove?: (context: FnContext<G> & { playerID: PlayerID }) => undefined | G;

  stages?: StageMap<G>;
}
