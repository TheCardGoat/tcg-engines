import { whenYouPlayThis } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kuzcoBoredRoyal: LorcanaCharacterCardDefinition = {
  id: "bk2",
  name: "Kuzco",
  title: "Bored Royal",
  characteristics: ["storyborn", "king"],
  text: "LLAMA BREATH When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 1,
  willpower: 3,
  illustrator: "Rachel Elese",
  number: 53,
  set: "008",
  rarity: "common",
  lore: 1,
  abilities: [
    whenYouPlayThis({
      name: "LLAMA BREATH",
      text: "When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              {
                filter: "type",
                value: ["character", "item", "location"],
              },
              {
                filter: "attribute",
                value: "cost",
                comparison: {
                  operator: "lte",
                  value: 2,
                },
              },
            ],
          },
        },
      ],
    }),
  ],
};
