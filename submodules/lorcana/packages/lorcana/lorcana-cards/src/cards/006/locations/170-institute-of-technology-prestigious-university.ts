import type { LocationCard } from "@tcg/lorcana-types";
import { instituteOfTechnologyPrestigiousUniversityI18n } from "./170-institute-of-technology-prestigious-university.i18n";

export const instituteOfTechnologyPrestigiousUniversity: LocationCard = {
  id: "cKc",
  canonicalId: "ci_cKc",
  reprints: ["set6-170"],
  cardType: "location",
  name: "Institute of Technology",
  version: "Prestigious University",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 170,
  rarity: "common",
  cost: 1,
  willpower: 5,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_b499c66fd5104b3a994c3a6bd51ba692",
    tcgPlayer: 591988,
  },
  text: [
    {
      title: "WELCOME TO THE LAB",
      description: "Inventor characters get +1 {W} while here.",
    },
    {
      title: "PUSH THE BOUNDARIES",
      description: "At the start of your turn, if you have a character here, gain 1 lore.",
    },
  ],
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "willpower",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "same-location-as-source",
            },
            {
              type: "has-classification",
              classification: "Inventor",
            },
          ],
        },
        type: "modify-stat",
      },
      id: "5mi-1",
      name: "WELCOME TO THE LAB",
      text: "WELCOME TO THE LAB Inventor characters get +1 {W} while here.",
      type: "static",
    },
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
        type: "gain-lore",
      },
      id: "5mi-2",
      name: "PUSH THE BOUNDARIES",
      text: "PUSH THE BOUNDARIES At the start of your turn, if you have a character here, gain 1 lore.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: instituteOfTechnologyPrestigiousUniversityI18n,
};
