import { wheneverTargetPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const weightSet: LorcanaItemCardDefinition = {
  id: "k1c",

  name: "Weight Set",
  characteristics: ["item"],
  text: "**TRAINING** Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.",
  type: "item",
  abilities: [
    wheneverTargetPlays({
      name: "Training",
      text: "Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.",
      optional: true,
      costs: [{ type: "ink", amount: 1 }],
      triggerFilter: [
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
        {
          filter: "attribute",
          value: "strength",
          comparison: { operator: "gte", value: 4 },
        },
      ],
      effects: [
        {
          type: "draw",
          amount: 1,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    }),
  ],
  flavour: "Go the distance with the right equipment.",
  colors: ["steel"],
  cost: 3,
  inkwell: true,
  illustrator: "Brian Weisz",
  number: 204,
  set: "ROF",
  rarity: "rare",
};
