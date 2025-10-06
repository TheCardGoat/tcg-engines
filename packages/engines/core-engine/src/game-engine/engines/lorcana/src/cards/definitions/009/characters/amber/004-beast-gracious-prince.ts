import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beastGraciousPrince: LorcanaCharacterCardDefinition = {
  id: "bgp",
  missingTestCase: true,
  name: "Beast",
  title: "Gracious Prince",
  characteristics: ["storyborn", "hero", "prince"],
  text: "FULL DANCE CARD Your Princess characters get +1 {S} and +1 {W}.",
  type: "character",
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 5,
  willpower: 4,
  illustrator: "",
  number: 4,
  set: "009",
  rarity: "rare",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "FULL DANCE CARD",
      text: "Your Princess characters get +1 {W}",
      effects: [
        {
          type: "attribute",
          attribute: "willpower",
          amount: 1,
          modifier: "add",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "characteristics", value: ["princess"] },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
    {
      type: "static",
      ability: "effects",
      name: "FULL DANCE CARD",
      text: "Your Princess characters get +1 {S}",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "characteristics", value: ["princess"] },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  lore: 1,
};
