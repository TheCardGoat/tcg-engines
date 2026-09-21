import type { CharacterCard } from "@tcg/op-types";
import { op04Baby5032I18n } from "./op04-032-baby-5.i18n.ts";

export const op04Baby5032: CharacterCard = {
  id: "OP04-032",
  canonicalId: "OP04-032",
  slug: "baby-5/op04-032",
  name: "Baby 5",
  printings: [
    {
      id: "OP04-032",
      artId: "OP04-032",
      setCode: "OP04",
      collectorNumber: "032",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-032.jpg",
    },
    {
      id: "OP04-032_p3",
      artId: "OP04-032_p3",
      setCode: "OP04",
      collectorNumber: "032",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-032_p3.jpg",
    },
    {
      id: "OP04-032_p3_0Zy6GwW",
      artId: "OP04-032_p3_0Zy6GwW",
      setCode: "OP04",
      collectorNumber: "032",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-032.jpg",
    },
    {
      id: "OP04-032_r1",
      artId: "OP04-032_r1",
      setCode: "OP04",
      collectorNumber: "032",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-032_r1.jpg",
      label: "Baby 5 (OP04-032) (Reprint)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP04",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[End of Your Turn] You may trash this Character: Set up to 2 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Baby5032I18n,
};
