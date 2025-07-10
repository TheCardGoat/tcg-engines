import type { FnContext, MoveMap } from "../../game-configuration";
import type { TurnConfig } from "./turn-types";

export interface PhaseConfig<G = unknown> {
  start?: boolean;
  next?: ((context: FnContext<G>) => string | undefined) | string;
  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
  endIf?: (context: FnContext<G>) => boolean | undefined | { next: string };
  moves?: MoveMap<G>;
  turn?: TurnConfig<G>;
  allowAnyPlayerToAct?: boolean;
}

export interface PhaseMap<G = unknown> {
  [phaseName: string]: PhaseConfig<G>;
}
