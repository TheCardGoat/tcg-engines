import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const snowWhiteUnexpectedHouseGuest: LorcanitoCharacterCardDefinition = {
  id: "pyl",
  name: "Snow White",
  title: "Unexpected Houseguest",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**HOW DO YOU DO?** You pay 1 {I} less to play Seven Dwarfs characters.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "How Do You Do?",
      text: "You pay 1 {I} less to play Seven Dwarfs characters.",
      effects: [
        {
          type: "replacement",
          replacement: "cost",
          duration: "static",
          amount: 1,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "characteristics", value: ["seven dwarfs"] },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Nothing says 'hello' better than a fresh-baked pie.",
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Samanta Erdini",
  number: 24,
  set: "ROF",
  rarity: "uncommon",
};
