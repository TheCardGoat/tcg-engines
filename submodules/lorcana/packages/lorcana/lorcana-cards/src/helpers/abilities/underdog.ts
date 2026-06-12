import type { StaticAbilityDefinition } from "@tcg/lorcana-types";

export const underdog: StaticAbilityDefinition = {
  name: "UNDERDOG",
  text: "UNDERDOG If this is your first turn and you're not the first player, you pay 1 {I} less to play this character.",
  type: "static",
  condition: {
    type: "first-turn-non-otp",
  },
  effect: {
    type: "cost-reduction",
    amount: 1,
    cardType: "character",
  },
  sourceZones: ["hand"],
};
