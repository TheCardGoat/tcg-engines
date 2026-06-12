import type { LocationCard } from "@tcg/lorcana-types";
import { rescueRangersSubmarineMobileHeadquartersI18n } from "./169-rescue-rangers-submarine-mobile-headquarters.i18n";

export const rescueRangersSubmarineMobileHeadquarters: LocationCard = {
  id: "DyS",
  canonicalId: "ci_DyS",
  reprints: ["set6-169"],
  cardType: "location",
  name: "Rescue Rangers Submarine",
  version: "Mobile Headquarters",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "006",
  cardNumber: 169,
  rarity: "rare",
  cost: 2,
  willpower: 8,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_d6deefa8519c46a39b105b62d7b857f4",
    tcgPlayer: 586641,
  },
  text: [
    {
      title: "PLANNING SESSION",
      description:
        "At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  abilities: [
    {
      effect: {
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
        then: {
          chooser: "CONTROLLER",
          effect: {
            exerted: true,
            facedown: true,
            source: "top-of-deck",
            target: "CONTROLLER",
            type: "put-into-inkwell",
          },
          type: "optional",
        },
        type: "conditional",
      },
      id: "671-1",
      name: "PLANNING SESSION",
      text: "PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: rescueRangersSubmarineMobileHeadquartersI18n,
};
