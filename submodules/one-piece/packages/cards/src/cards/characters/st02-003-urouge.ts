import type { CharacterCard } from "@tcg/op-types";
import { st02Urouge003I18n } from "./st02-003-urouge.i18n.ts";
export const st02Urouge003: CharacterCard = {
  id: "ST02-003",
  canonicalId: "ST02-003",
  slug: "urouge/st02-003",
  name: "Urouge",
  printings: [
    {
      id: "ST02-003",
      artId: "ST02-003",
      setCode: "ST02",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST02-003.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST02",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Supernovas", "Fallen Monk Pirates"],
  attribute: "strike",
  effect: "[DON!! x1] If you have 3 or more Characters, this card gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st02Urouge003I18n,
};
