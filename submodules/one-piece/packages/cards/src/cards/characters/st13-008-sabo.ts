import type { CharacterCard } from "@tcg/op-types";
import { st13Sabo008I18n } from "./st13-008-sabo.i18n.ts";
export const st13Sabo008: CharacterCard = {
  id: "ST13-008",
  canonicalId: "ST13-008",
  slug: "sabo/st13-008",
  name: "Sabo",
  printings: [
    {
      id: "ST13-008",
      artId: "ST13-008",
      setCode: "ST13",
      collectorNumber: "008",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST13-008.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST13",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Dressrosa", "Revolutionary Army"],
  attribute: "special",
  effect:
    "[On Play] You may trash 1 card from the top or bottom of your Life cards: K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashLife",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st13Sabo008I18n,
};
