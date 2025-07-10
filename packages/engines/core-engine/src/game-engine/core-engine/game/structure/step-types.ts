import type { MoveMap } from "../../game-configuration";

export interface StageConfig<G = unknown> {
  moves?: MoveMap<G>;
  next?: string;
}

export interface StageMap<G = unknown> {
  [stageName: string]: StageConfig<G>;
}
