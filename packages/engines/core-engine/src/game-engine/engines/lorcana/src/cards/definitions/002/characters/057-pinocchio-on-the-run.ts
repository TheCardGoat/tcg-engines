import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pinocchioOnTheRun: LorcanaCharacterCardDefinition = {
  id: "juq",

  name: "Pinocchio",
  title: "On the Run",
  characteristics: ["hero", "floodborn"],
  text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Pinocchio._)\n**LISTEN TO YOUR CONSCIENCE** When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
  type: "character",
  abilities: [
    shiftAbility(3, "pinocchio"),
    {
      type: "resolution",
      optional: true,
      name: "LISTEN TO YOUR CONSCIENCE",
      text: "When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["character", "item"] },
              { filter: "zone", value: "play" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 3 },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour: "He raced into the Inklands without a thought.",
  colors: ["amethyst"],
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Isaiah Mesq",
  number: 57,
  set: "ROF",
  rarity: "uncommon",
};
