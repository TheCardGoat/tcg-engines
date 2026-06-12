import type { CharacterCard } from "@tcg/lorcana-types";
import { montereyJackHypnotizedByCheeseI18n } from "./012-monterey-jack-hypnotized-by-cheese.i18n";

export const montereyJackHypnotizedByCheese: CharacterCard = {
  id: "rZB",
  canonicalId: "ci_rZB",
  reprints: ["set12-012"],
  cardType: "character",
  name: "Monterey Jack",
  version: "Hypnotized by Cheese",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 12,
  rarity: "rare",
  cost: 2,
  strength: 0,
  willpower: 3,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_490b647e01e44f77b1413fa6fc30b023",
  },
  text: [
    {
      title: "BREAK THE TRANCE",
      description:
        "This character can't quest unless you have a character with 4 {W} or more in play.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "rZB-1",
      name: "BREAK THE TRANCE",
      type: "static",
      text: "BREAK THE TRANCE This character can't quest unless you have a character with 4 {W} or more in play.",
      condition: {
        type: "not",
        condition: {
          type: "target-query",
          query: {
            selector: "all",
            owner: "you",
            zones: ["play"],
            cardType: "character",
            filters: [
              {
                type: "willpower-comparison",
                comparison: "greater-or-equal",
                value: 4,
              },
            ],
          },
          comparison: {
            operator: "gte",
            value: 1,
          },
        },
      },
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      },
    },
  ],
  i18n: montereyJackHypnotizedByCheeseI18n,
};
