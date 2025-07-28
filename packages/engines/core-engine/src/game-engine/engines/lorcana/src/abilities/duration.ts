import type { AbilityDuration } from "~/game-engine/engines/lorcana/src/abilities/ability-types";

export const UNTIL_START_OF_YOUR_NEXT_TURN: AbilityDuration = {
  type: "untilStartOfNextTurn",
};

export const FOR_THE_REST_OF_THIS_TURN: AbilityDuration = {
  type: "forTheRestOfThisTurn",
};

export const THIS_TURN: AbilityDuration = FOR_THE_REST_OF_THIS_TURN;

export const DURING_THEIR_NEXT_TURN: AbilityDuration = {
  type: "duringTheirNextTurn",
};
