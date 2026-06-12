import type { CharacterCard } from "@tcg/op-types";
import { eb03Stussy043I18n } from "./043-stussy.i18n.ts";

export const eb03Stussy043: CharacterCard = {
  id: "EB03-043",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB03",
  cost: 7,
  power: 7000,
  traits: ["CP0"],
  attribute: "special",
  effect:
    '[Blocker] [On Play] You may place 2 cards with a type including "CP" from your trash at the bottom of your deck in any order: K.O. up to 1 of your opponent\'s Characters with a cost of 4 or less.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
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
                  value: 4,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03Stussy043I18n,
};
