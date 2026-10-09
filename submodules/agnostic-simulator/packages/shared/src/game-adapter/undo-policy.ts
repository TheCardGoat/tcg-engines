import type { GameAdapter } from "./types.js";

/** Ranked hosted matches require bilateral undo consent. */
export const hostedUndoProposalPolicy: NonNullable<GameAdapter["proposalPolicy"]> = {
  consentFor(_action, context) {
    return context.matchType === "ranked" ? "opponent" : "automatic";
  },
};
