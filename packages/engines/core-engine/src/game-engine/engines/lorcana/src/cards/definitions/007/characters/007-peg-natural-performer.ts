import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pegNaturalPerformer: LorcanaCharacterCardDefinition = {
  id: "dly",
  name: "Peg",
  title: "Natural Performer",
  characteristics: ["storyborn", "ally"],
  text: "CAPTIVE AUDIENCE {E} – If you have at least 3 other characters in play, draw a card.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "CAPTIVE AUDIENCE",
      text: "{E} – If you have at least 3 other characters in play, draw a card.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "draw",
          amount: 1,
          target: self,
          conditions: [
            {
              type: "filter",
              filters: [
                { filter: "zone", value: "play" },
                { filter: "owner", value: "self" },
                { filter: "type", value: "character" },
                { filter: "source", value: "other" },
              ],
              comparison: { operator: "gte", value: 3 },
            },
          ],
        },
      ],
    },
  ],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["emerald", "amber"],
  cost: 3,
  strength: 2,
  willpower: 4,
  illustrator: "Mariana Moreno",
  number: 7,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
