import type { LocationCard } from "@tcg/lorcana-types";
import { galacticCouncilChamberCourtroomI18n } from "./204-galactic-council-chamber-courtroom.i18n";

export const galacticCouncilChamberCourtroom: LocationCard = {
  id: "WjQ",
  canonicalId: "ci_WjQ",
  reprints: ["set6-204"],
  cardType: "location",
  name: "Galactic Council Chamber",
  version: "Courtroom",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 204,
  rarity: "common",
  cost: 3,
  willpower: 7,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_25d8f80f68574d38869b7853d737e8e2",
    tcgPlayer: 578235,
  },
  text: [
    {
      title: "FEDERATION DECREE",
      description:
        "While you have an Alien or Robot character here, this location can't be challenged.",
    },
  ],
  abilities: [
    {
      id: "5pr-1",
      name: "FEDERATION DECREE",
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
                  classification: "Alien",
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
                  classification: "Robot",
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
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
      },
      text: "FEDERATION DECREE While you have an Alien or Robot character here, this location can't be challenged.",
      type: "static",
    },
  ],
  i18n: galacticCouncilChamberCourtroomI18n,
};
