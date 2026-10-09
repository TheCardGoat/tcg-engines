import type { CharacterCard } from "@tcg/op-types";
import { st08Koby004I18n } from "./st08-004-koby.i18n.ts";
export const st08Koby004: CharacterCard = {
  id: "ST08-004",
  canonicalId: "ST08-004",
  slug: "koby/st08-004",
  name: "Koby",
  printings: [
    {
      id: "ST08-004",
      artId: "ST08-004",
      setCode: "ST08",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST08-004.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST08",
  traits: ["Navy"],
  cost: 4,
  power: 1000,
  counter: 1000,
  attribute: "strike",
  effect:
    "[Activate: Main] You may rest this Character: K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
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
                  value: 2,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st08Koby004I18n,
};
