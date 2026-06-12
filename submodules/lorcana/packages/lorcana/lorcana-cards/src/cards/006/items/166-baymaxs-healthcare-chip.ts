import type { ItemCard } from "@tcg/lorcana-types";
import { baymaxsHealthcareChipI18n } from "./166-baymaxs-healthcare-chip.i18n";

export const baymaxsHealthcareChip: ItemCard = {
  id: "zdZ",
  canonicalId: "ci_zdZ",
  reprints: ["set6-166"],
  cardType: "item",
  name: "Baymax's Healthcare Chip",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 166,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_edfd3ef020dd41d5b1733088bdf2c991",
    tcgPlayer: 587969,
  },
  text: [
    {
      title: "10,000 MEDICAL PROCEDURES",
      description: "{E} — Choose one:",
    },
    {
      title: "* Remove up to 1 damage from chosen character.",
    },
    {
      title:
        "* If you have a Robot character in play, remove up to 3 damage from chosen character.",
    },
  ],
  abilities: [
    {
      id: "81j-1",
      name: "10,000 MEDICAL PROCEDURES",
      type: "activated",
      cost: {
        exert: true,
      },
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
                type: "has-classification",
                classification: "Robot",
              },
            ],
          },
          comparison: {
            operator: "gte",
            value: 1,
          },
        },
        then: {
          type: "or",
          optionLabels: [
            "Remove up to 1 damage from chosen character",
            "Remove up to 3 damage from chosen character",
          ],
          options: [
            {
              type: "remove-damage",
              amount: { type: "up-to", value: 1 },
              target: "CHOSEN_CHARACTER",
            },
            {
              type: "remove-damage",
              amount: { type: "up-to", value: 3 },
              target: "CHOSEN_CHARACTER",
            },
          ],
        },
        else: {
          type: "remove-damage",
          amount: { type: "up-to", value: 1 },
          target: "CHOSEN_CHARACTER",
        },
      },
      text: "10,000 MEDICAL PROCEDURES {E} — Choose one:",
    },
  ],
  i18n: baymaxsHealthcareChipI18n,
};
