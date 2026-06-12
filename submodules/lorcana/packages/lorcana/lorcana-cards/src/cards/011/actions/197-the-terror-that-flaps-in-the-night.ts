import type { ActionCard } from "@tcg/lorcana-types";
import { theTerrorThatFlapsInTheNightI18n } from "./197-the-terror-that-flaps-in-the-night.i18n";

export const theTerrorThatFlapsInTheNight: ActionCard = {
  id: "Jrb",
  canonicalId: "ci_Jrb",
  reprints: ["set11-197"],
  cardType: "action",
  name: "The Terror That Flaps in the Night",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 197,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e615766ea0d647aba10803d596d3adb7",
    tcgPlayer: 677141,
  },
  text: "Deal 2 damage to chosen opposing character. If you have a character named Darkwing Duck in play, deal 3 damage instead.",
  abilities: [
    {
      type: "action",
      text: "Deal 2 damage to chosen opposing character. If you have a character named Darkwing Duck in play, deal 3 damage instead.",
      effect: {
        type: "conditional",
        condition: {
          type: "target-query",
          query: {
            selector: "all",
            owner: "you",
            zones: ["play"],
            cardType: "character",
            filters: [
              {
                type: "name",
                equals: "Darkwing Duck",
              },
            ],
          },
          comparison: {
            operator: "gte",
            value: 1,
          },
        },
        then: {
          type: "deal-damage",
          amount: 3,
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
        else: {
          type: "deal-damage",
          amount: 2,
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
  i18n: theTerrorThatFlapsInTheNightI18n,
};
