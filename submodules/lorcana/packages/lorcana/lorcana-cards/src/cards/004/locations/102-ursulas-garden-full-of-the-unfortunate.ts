import type { LocationCard } from "@tcg/lorcana-types";
import { ursulasGardenFullOfTheUnfortunateI18n } from "./102-ursulas-garden-full-of-the-unfortunate.i18n";

export const ursulasGardenFullOfTheUnfortunate: LocationCard = {
  id: "S3h",
  canonicalId: "ci_S3h",
  reprints: ["set4-102"],
  cardType: "location",
  name: "Ursula’s Garden",
  version: "Full of the Unfortunate",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 102,
  rarity: "rare",
  cost: 4,
  willpower: 7,
  moveCost: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5b7970f5f54d4311882227c856ac28ac",
    tcgPlayer: 547688,
  },
  text: [
    {
      title: "ABANDON HOPE",
      description: "While you have an exerted character here, opposing characters get -1 {L}.",
    },
  ],
  abilities: [
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "same-location-as-source",
            },
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
      effect: {
        modifier: -1,
        stat: "lore",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "1h6-1",
      name: "ABANDON HOPE",
      text: "ABANDON HOPE While you have an exerted character here, opposing characters get -1 {L}.",
      type: "static",
    },
  ],
  i18n: ursulasGardenFullOfTheUnfortunateI18n,
};
