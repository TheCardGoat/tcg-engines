import type { CharacterCard } from "@tcg/op-types";
import { st09Kaido004I18n } from "./st09-004-kaido.i18n.ts";
export const st09Kaido004: CharacterCard = {
  id: "ST09-004",
  canonicalId: "ST09-004",
  slug: "kaido/st09-004",
  name: "Kaido",
  printings: [
    {
      id: "ST09-004",
      artId: "ST09-004",
      setCode: "ST09",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST09-004.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST09",
  cost: 4,
  traits: ["The Four Emperors", "Animal Kingdom Pirates"],
  power: 5000,
  attribute: "special",
  counter: 1000,
  effect: "[DON!! x1] If you have 2 or less Life cards, this Character cannot be K.O.'d in battle.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
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
  i18n: st09Kaido004I18n,
};
