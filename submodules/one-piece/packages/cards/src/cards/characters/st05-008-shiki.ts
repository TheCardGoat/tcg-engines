import type { CharacterCard } from "@tcg/op-types";
import { st05Shiki008I18n } from "./st05-008-shiki.i18n.ts";

export const st05Shiki008: CharacterCard = {
  id: "ST05-008",
  canonicalId: "ST05-008",
  slug: "shiki/st05-008",
  name: "Shiki",
  printings: [
    {
      id: "ST05-008",
      artId: "ST05-008",
      setCode: "ST05",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-008.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["FILM", "Golden Lion Pirates"],
  attribute: "slash",
  effect:
    "If you have 8 or more DON!! cards on your field, this Character cannot be K.O.'d in battle.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 8,
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "inBattle",
          },
        ],
      },
    ],
  },
  i18n: st05Shiki008I18n,
};
