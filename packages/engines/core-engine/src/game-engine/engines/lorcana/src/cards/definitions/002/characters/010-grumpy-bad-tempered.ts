import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const grumpyBadTempered: LorcanaCharacterCardDefinition = {
  id: "wsw",
  name: "Grumpy",
  title: "Bad-Tempered",
  characteristics: ["storyborn", "ally", "seven dwarfs"],
  text: "**THERE'S TROUBLE A-BREWIN'** Your other Seven Dwarfs characters get +1 {S}.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "There's Trouble A-Brewin",
      text: "Your other Seven Dwarfs characters get +1 {S}.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          modifier: "add",
          amount: 1,
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            excludeSelf: true,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "characteristics", value: ["seven dwarfs"] },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Sour as a green gooseberry!",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Kendall Hale",
  number: 10,
  set: "ROF",
  rarity: "common",
};
