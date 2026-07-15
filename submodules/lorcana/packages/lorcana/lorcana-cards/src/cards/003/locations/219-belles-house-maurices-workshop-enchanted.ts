import type { LocationCard } from "@tcg/lorcana-types";
import { bellesHouseMauricesWorkshopEnchantedI18n } from "./219-belles-house-maurices-workshop-enchanted.i18n";

export const bellesHouseMauricesWorkshopEnchanted: LocationCard = {
  id: "yeq",
  canonicalId: "ci_6N3",
  slug: "lorcana-ci_6N3",
  printings: [
    {
      id: "set3-219-enchanted",
      artId: "ci_6N3-enchanted",
      setCode: "set3",
      collectorNumber: "219",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set3-168"],
  cardType: "location",
  name: "Belle's House",
  version: "Maurice's Workshop",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "003",
  cardNumber: 219,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 1,
  willpower: 6,
  moveCost: 2,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_c9f08696c3cd44bf96e2a149bb3cfb12",
    tcgPlayer: "539169",
  },
  text: [
    {
      title: "LABORATORY",
      description: "If you have a character here, you pay 1 {I} less to play items.",
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
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        amount: 1,
        cardType: "item",
        type: "cost-reduction",
      },
      id: "jgM-1",
      name: "LABORATORY",
      text: "LABORATORY If you have a character here, you pay 1 {I} less to play items.",
      type: "static",
    },
  ],
  i18n: bellesHouseMauricesWorkshopEnchantedI18n,
};
