import type { LocationCard } from "@tcg/lorcana-types";
import { prideLandsPrideRockEnchantedI18n } from "./207-pride-lands-pride-rock-enchanted.i18n";

export const prideLandsPrideRockEnchanted: LocationCard = {
  id: "j0p",
  canonicalId: "ci_udL",
  slug: "lorcana-ci_udL",
  printings: [
    {
      id: "set3-207-enchanted",
      artId: "ci_udL-enchanted",
      setCode: "set3",
      collectorNumber: "207",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set3-033"],
  cardType: "location",
  name: "Pride Lands",
  version: "Pride Rock",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "003",
  cardNumber: 207,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 2,
  willpower: 7,
  moveCost: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_bbb647e1cbe3487baa2ad65b27a999ba",
    tcgPlayer: "539157",
  },
  text: [
    {
      title: "WE ARE ALL CONNECTED",
      description: "Characters get +2 {W} while here.",
    },
    {
      title: "LION HOME",
      description:
        "If you have a Prince or King character here, you pay 1 {I} less to play characters.",
    },
  ],
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "willpower",
        target: "CHARACTERS_HERE",
        type: "modify-stat",
      },
      id: "1ph-1",
      name: "WE ARE ALL CONNECTED",
      text: "WE ARE ALL CONNECTED Characters get +2 {W} while here.",
      type: "static",
    },
    {
      effect: {
        amount: 1,
        cardType: "character",
        type: "cost-reduction",
      },
      id: "1ph-2",
      name: "LION HOME",
      text: "LION HOME If you have a Prince or King character here, you pay 1 {I} less to play characters.",
      type: "static",
      condition: {
        type: "or",
        conditions: [
          {
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
                  type: "has-classification",
                  classification: "Prince",
                },
              ],
            },
            comparison: {
              operator: "gte",
              value: 1,
            },
          },
          {
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
                  type: "has-classification",
                  classification: "King",
                },
              ],
            },
            comparison: {
              operator: "gte",
              value: 1,
            },
          },
        ],
      },
    },
  ],
  i18n: prideLandsPrideRockEnchantedI18n,
};
