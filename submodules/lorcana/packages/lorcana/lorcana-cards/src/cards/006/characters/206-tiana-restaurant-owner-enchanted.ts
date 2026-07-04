import type { CharacterCard } from "@tcg/lorcana-types";
import { tianaRestaurantOwnerEnchantedI18n } from "./206-tiana-restaurant-owner-enchanted.i18n";

export const tianaRestaurantOwnerEnchanted: CharacterCard = {
  id: "eH1",
  canonicalId: "ci_1Oj",
  slug: "lorcana-ci_1Oj",
  printings: [
    {
      id: "set6-206-enchanted",
      artId: "ci_1Oj-enchanted",
      setCode: "set6",
      collectorNumber: "206",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set6-016"],
  cardType: "character",
  name: "Tiana",
  version: "Restaurant Owner",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "006",
  cardNumber: 206,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_4dfb12a1e5844317a783074a548bc8c7",
    tcgPlayer: "592031",
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
            filters: [
              {
                type: "exerted",
              },
            ],
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
  i18n: tianaRestaurantOwnerEnchantedI18n,
};
