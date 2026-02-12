import type { LocationCard } from "@tcg/lorcana-types";

export const instituteOfTechnologyPrestigiousUniversity: LocationCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 1,
        target: "CHARACTERS_HERE",
      },
      id: "5mi-1",
      name: "WELCOME TO THE LAB Inventor",
      text: "WELCOME TO THE LAB Inventor characters get +1 {W} while here.",
      type: "static",
    },
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character here",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      id: "5mi-2",
      text: "PUSH THE BOUNDARIES At the start of your turn, if you have a character here, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 170,
  cardType: "location",
  cost: 1,
  externalIds: {
    ravensburger: "00902a5a0fbc97e1a6a6e0901d349c5cd34db777",
  },
  franchise: "Big Hero 6",
  fullName: "Institute of Technology - Prestigious University",
  id: "5mi",
  inkType: ["sapphire"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Institute of Technology",
  set: "006",
  text: "WELCOME TO THE LAB Inventor characters get +1 {W} while here.\nPUSH THE BOUNDARIES At the start of your turn, if you have a character here, gain 1 lore.",
  version: "Prestigious University",
};
