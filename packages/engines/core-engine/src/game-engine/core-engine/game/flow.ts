import { processSegments } from "~/game-engine/core-engine/game/structure/segment";
import type { GameDefinition } from "~/game-engine/core-engine/game-configuration";
import {
  type CoreCtx,
  createCtx,
} from "~/game-engine/core-engine/state/context";
import type { GameCards } from "~/game-engine/core-engine/types";

type PlayerID = string;

/**
 * Flow
 *
 * Creates a reducer that updates ctx (analogous to how moves update G).
 */
export function Flow(
  gameDefinition: GameDefinition,
  cards: GameCards,
  players?: string[],
) {
  const { segments } = gameDefinition;

  const segmentsMap = { ...segments };
  const moveMap = { ...(gameDefinition.moves || {}) };
  const moveNames = new Set<string>();

  if (gameDefinition.moves) {
    for (const name of Object.keys(gameDefinition.moves)) {
      moveNames.add(name);
    }
  }

  const { startingSegment, segmentMoveNames, segmentMoveMap } =
    processSegments(segmentsMap);

  // Store both qualified and simple move names in the map
  for (const qualifiedName of Object.keys(segmentMoveMap)) {
    moveMap[qualifiedName] = segmentMoveMap[qualifiedName];

    // Extract the simple move name from the qualified name
    // e.g., "startingAGame.chooseFirstPlayer.chooseFirstPlayer" -> "chooseFirstPlayer"
    const parts = qualifiedName.split(".");
    const simpleName = parts[parts.length - 1]; // Get the last part

    // Store the move under the simple name as well
    moveMap[simpleName] = segmentMoveMap[qualifiedName];
  }

  for (const moveName of segmentMoveNames) {
    moveNames.add(moveName);
  }

  // Determine starting phase and step if any
  let initialPhase;
  let initialStep;

  if (startingSegment && segments[startingSegment]) {
    const segmentConfig = segments[startingSegment];
    const phases = segmentConfig.turn.phases;

    if (phases) {
      for (const phaseName in phases) {
        if (phases[phaseName].start) {
          initialPhase = phaseName;

          const steps = phases[phaseName].steps;
          if (steps) {
            for (const stepName in steps) {
              if (steps[stepName].start) {
                initialStep = stepName;
                break;
              }
            }
          }

          break;
        }
      }
    }
  }

  return {
    ctx: createCtx({
      playerOrder: players || [],
      initialSegment: startingSegment,
      initialPhase,
      initialStep,
      cards,
      players: players?.reduce(
        (acc, player) => {
          acc[player] = { id: player, name: player, turnHistory: [] };
          return acc;
        },
        {} as Record<
          PlayerID,
          { id: PlayerID; name: string; turnHistory: unknown[] }
        >,
      ),
    }),
    moveMap,
    moveNames: [...moveNames.values()],
    getMove: (ctx: CoreCtx, name: string, playerID: PlayerID) => {
      // First try the collected moveMap (which includes phase-specific moves)
      if (name in moveMap) {
        return moveMap[name];
      }
    },
  };
}
