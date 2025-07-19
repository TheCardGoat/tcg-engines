import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import type { LorcanaMove } from "./types";
import { toLorcanaCoreOps } from "./types";

export const exertCard: LorcanaMove = (
  { G, coreOps, playerID },
  params: { card: string; exerted: boolean },
) => {
  try {
    const { card } = params;
    const lorcanaOps = toLorcanaCoreOps(coreOps);

    // Handle exerted state
    if (params.exerted) {
      lorcanaOps.exertCard(card);
    } else {
      lorcanaOps.readyCard(card);
    }

    return G;
  } catch (error) {
    return G; // Just return state on error
  }
};

/**
 * Move character to location using coreOps.getCtx() instead of requiring ctx directly
 */
export const moveCharacterToLocationImproved: LorcanaMove = (
  { G, coreOps, playerID },
  locationInstanceId: string,
  characterInstanceId: string,
) => {
  try {
    const lorcanaOps = toLorcanaCoreOps(coreOps);
    // Get ctx from coreOps instead of having it passed directly
    const ctx = lorcanaOps.getCtx();

    // Ensure we're in the main phase (this is a turn action)
    if (ctx.currentPhase !== "mainPhase") {
      return createInvalidMove(
        "WRONG_PHASE",
        "moves.moveCharacterToLocation.errors.wrongPhase",
        { currentPhase: ctx.currentPhase, expectedPhase: "mainPhase" },
      );
    }

    const characterInstance = lorcanaOps.getCardInstance(characterInstanceId);
    if (!characterInstance) {
      return createInvalidMove(
        "CHARACTER_NOT_FOUND",
        "moves.moveCharacterToLocation.errors.characterNotFound",
        { instanceId: characterInstanceId },
      );
    }

    const locationInstance = lorcanaOps.getCardInstance(locationInstanceId);
    if (!locationInstance) {
      return createInvalidMove(
        "LOCATION_NOT_FOUND",
        "moves.moveCharacterToLocation.errors.locationNotFound",
        { instanceId: locationInstanceId },
      );
    }

    // Implement move logic
    lorcanaOps.enterLocation(characterInstance, locationInstance);

    return G;
  } catch (error) {
    return G; // Just return state on error
  }
};
