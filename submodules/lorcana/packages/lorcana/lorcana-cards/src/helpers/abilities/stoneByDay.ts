import type { StaticAbilityDefinition } from "@tcg/lorcana-types";

export const stoneByDay: StaticAbilityDefinition = {
  name: "STONE BY DAY",
  text: "STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  type: "static",
  condition: {
    type: "resource-count",
    what: "cards-in-hand",
    controller: "you",
    comparison: "greater-or-equal",
    value: 3,
  },
  effect: {
    type: "restriction",
    restriction: "cant-ready",
    target: "SELF",
  },
};
