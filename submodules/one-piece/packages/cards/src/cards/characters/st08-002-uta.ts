import type { CharacterCard } from "@tcg/op-types";
import { st08Uta002I18n } from "./st08-002-uta.i18n.ts";
export const st08Uta002: CharacterCard = {
  id: "ST08-002",
  canonicalId: "ST08-002",
  slug: "uta/st08-002",
  name: "Uta",
  printings: [
    {
      id: "ST08-002",
      artId: "ST08-002",
      setCode: "ST08",
      collectorNumber: "002",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST08-002.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "ST08",
  traits: ["FILM"],
  cost: 2,
  power: 3000,
  attribute: "special",
  effect:
    "This Character cannot be K.O.'d in battle by Leaders. [Activate: Main] You may rest this Character: Give up to 1 of your opponent's Characters −2 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
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
            byFilter: [
              {
                filter: "cardCategory",
                value: "leader",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: st08Uta002I18n,
};
