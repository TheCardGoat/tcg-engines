import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Chew050I18n } from "./050-chew.i18n.ts";

export const op14eb04Chew050: CharacterCard = {
  id: "OP14-050",
  canonicalId: "OP14-050",
  slug: "chew/op14-050",
  name: "Chew",
  printings: [
    {
      id: "OP14-050",
      artId: "OP14-050",
      setCode: "OP14EB04",
      collectorNumber: "050",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-050_3oHPNxJ.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  power: 3000,
  traits: ["Fish-Man The Sun Pirates"],
  attribute: "ranged",
  effect: "[On Play] If your Leader has the {Fish-Man} type, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Fish-Man",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op14eb04Chew050I18n,
};
