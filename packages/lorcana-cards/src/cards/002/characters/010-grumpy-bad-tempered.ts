import type { CharacterCard } from "@tcg/lorcana-types";

export const grumpyBadtempered: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "11e-1",
      name: "THERE'S TROUBLE A-BREWIN' Your other Seven Dwarfs",
      text: "THERE'S TROUBLE A-BREWIN' Your other Seven Dwarfs characters get +1 {S}.",
      type: "static",
    },
  ],
  cardNumber: 10,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  cost: 4,
  externalIds: {
    ravensburger: "86c738780547edd83463f5cab7ae01ef47d47e64",
  },
  franchise: "Snow White",
  fullName: "Grumpy - Bad-Tempered",
  id: "11e",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Grumpy",
  set: "002",
  strength: 3,
  text: "THERE'S TROUBLE A-BREWIN' Your other Seven Dwarfs characters get +1 {S}.",
  version: "Bad-Tempered",
  willpower: 4,
};
