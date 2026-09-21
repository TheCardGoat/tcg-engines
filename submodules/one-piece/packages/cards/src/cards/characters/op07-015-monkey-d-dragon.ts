import type { CharacterCard } from "@tcg/op-types";
import { op07MonkeyDDragon015I18n } from "./op07-015-monkey-d-dragon.i18n.ts";

export const op07MonkeyDDragon015: CharacterCard = {
  id: "OP07-015",
  canonicalId: "OP07-015",
  slug: "monkey-d-dragon/op07-015",
  name: "Monkey.D.Dragon",
  printings: [
    {
      id: "OP07-015",
      artId: "OP07-015",
      setCode: "OP07",
      collectorNumber: "015",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-015.jpg",
    },
    {
      id: "OP07-015_p1",
      artId: "OP07-015_p1",
      setCode: "OP07",
      collectorNumber: "015",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-015_p1.jpg",
    },
    {
      id: "OP07-015_p2",
      artId: "OP07-015_p2",
      setCode: "OP07",
      collectorNumber: "015",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-015_p2.jpg",
    },
    {
      id: "OP07-015_r1",
      artId: "OP07-015_r1",
      setCode: "OP07",
      collectorNumber: "015",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-015_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP07",
  cost: 8,
  power: 9000,
  traits: ["Revolutionary Army"],
  attribute: "special",

  effect:
    "[Rush](This card can attack on the turn in which it is played.) [On Play] Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op07MonkeyDDragon015I18n,
};
