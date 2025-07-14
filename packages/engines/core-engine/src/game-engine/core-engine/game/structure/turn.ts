import {
  type PhaseMap,
  processPhases,
} from "~/game-engine/core-engine/game/structure/phase";
import type {
  FnContext,
  MoveMap,
} from "~/game-engine/core-engine/game-configuration";

export interface TurnMap<G = unknown> {
  [turnName: string]: TurnConfig<G>;
}

export interface TurnConfig<G = unknown> {
  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
  endIf?: (context: FnContext<G>) => boolean | undefined;

  moves?: MoveMap<G>;
  phases?: PhaseMap<G>;
}

export function processTurns<G = unknown>(turnsMap: TurnMap<G>) {
  const turnMoveMap = {};
  const turnMoveNames = new Set<string>();

  for (const turn in turnsMap) {
    const turnConfig = turnsMap[turn];

    if (turnConfig.endIf === undefined) {
      turnConfig.endIf = () => undefined;
    }
    if (turnConfig.onBegin === undefined) {
      turnConfig.onBegin = ({ G }) => G;
    }
    if (turnConfig.onEnd === undefined) {
      turnConfig.onEnd = ({ G }) => G;
    }

    if (turnConfig.moves !== undefined) {
      for (const move of Object.keys(turnConfig.moves)) {
        turnMoveMap[move] = turnConfig.moves[move];
        turnMoveNames.add(move);
      }
    }

    if (turnConfig.phases !== undefined) {
      const { phaseMoveMap, phaseMoveNames } = processPhases(turnConfig.phases);

      for (const moveName of Object.keys(phaseMoveMap)) {
        turnMoveMap[moveName] = phaseMoveMap[moveName];
      }

      for (const moveName of phaseMoveNames) {
        turnMoveNames.add(moveName);
      }
    }
  }

  return { turnMoveMap, turnMoveNames };
}
