import type { ItemCard } from "@tcg/lorcana-types";
import { spaghettiDinnerI18n } from "./042-spaghetti-dinner.i18n";

export const spaghettiDinner: ItemCard = {
  id: "4Q1",
  canonicalId: "ci_4Q1",
  reprints: ["set7-042"],
  cardType: "item",
  name: "Spaghetti Dinner",
  inkType: ["amber"],
  franchise: "Lady and the Tramp",
  set: "007",
  cardNumber: 42,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_568855977d47447e9b2977c859dc31c7",
    tcgPlayer: 618164,
  },
  text: [
    {
      title: "FINE DINING",
      description: "{E}, 1 {I} — If you have 2 or more characters in play, gain 1 lore.",
    },
  ],
  abilities: [
    {
      name: "FINE DINING",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-character-count",
          controller: "you",
          comparison: "greater-or-equal",
          count: 2,
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
      },
      id: "1bi-1",
      text: "FINE DINING {E}, 1 {I} — If you have 2 or more characters in play, gain 1 lore.",
      type: "activated",
    },
  ],
  i18n: spaghettiDinnerI18n,
};
