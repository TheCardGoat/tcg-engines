import type { CharacterCard } from "@tcg/lorcana-types";

export const grumpyBadtempered: CharacterCard = {
  id: "11e",
  cardType: "character",
  name: "Grumpy",
  version: "Bad-Tempered",
  fullName: "Grumpy - Bad-Tempered",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "THERE'S TROUBLE A-BREWIN' Your other Seven Dwarfs characters get +1 {S}.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 10,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "86c738780547edd83463f5cab7ae01ef47d47e64",
  },
  abilities: [
    {
      id: "11e-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
      },
      name: "THERE'S TROUBLE A-BREWIN' Your other Seven Dwarfs",
      text: "THERE'S TROUBLE A-BREWIN' Your other Seven Dwarfs characters get +1 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
};
