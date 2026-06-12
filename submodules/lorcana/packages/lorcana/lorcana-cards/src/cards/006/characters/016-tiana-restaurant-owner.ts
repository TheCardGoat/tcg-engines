import type { CharacterCard } from "@tcg/lorcana-types";
import { tianaRestaurantOwnerI18n } from "./016-tiana-restaurant-owner.i18n";

export const tianaRestaurantOwner: CharacterCard = {
  id: "Mvh",
  canonicalId: "ci_1Oj",
  reprints: ["set6-016"],
  cardType: "character",
  name: "Tiana",
  version: "Restaurant Owner",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "006",
  cardNumber: 16,
  rarity: "legendary",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_4dfb12a1e5844317a783074a548bc8c7",
    tcgPlayer: 592031,
  },
  text: [
    {
      title: "SPECIAL RESERVATION",
      description:
        "Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        type: "or",
        chooser: "OPPONENT",
        optionLabels: ["Pay 3 {I}", "The challenging character gets -3 {S} this turn"],
        options: [
          {
            type: "pay-cost",
            cost: {
              ink: 3,
            },
            effect: {
              type: "sequence",
              steps: [],
            },
          },
          {
            duration: "this-turn",
            modifier: -3,
            stat: "strength",
            target: {
              ref: "attacker",
            },
            type: "modify-stat",
          },
        ],
      },
      id: "6kc-1",
      name: "SPECIAL RESERVATION",
      text: "SPECIAL RESERVATION Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
      trigger: {
        event: "challenged",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        condition: {
          type: "target-query",
          query: {
            selector: "all",
            reference: "source",
            filters: [{ type: "exerted" }],
          },
          comparison: {
            operator: "gte",
            value: 1,
          },
        },
      },
      type: "triggered",
    },
  ],
  i18n: tianaRestaurantOwnerI18n,
};
