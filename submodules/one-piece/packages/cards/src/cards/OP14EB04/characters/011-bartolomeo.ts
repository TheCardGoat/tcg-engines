import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Bartolomeo011I18n } from "./011-bartolomeo.i18n.ts";

export const op14eb04Bartolomeo011: CharacterCard = {
  id: "OP14-011",
  canonicalId: "OP14-011",
  slug: "bartolomeo/op14-011",
  name: "Bartolomeo",
  printings: [
    {
      id: "OP14-011",
      artId: "OP14-011",
      setCode: "OP14EB04",
      collectorNumber: "011",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-011_JG4q8mf.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Supernovas Dressrosa Barto Club"],
  attribute: "special",
  effect:
    "[DON!! x2] This Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Bartolomeo011I18n,
};
