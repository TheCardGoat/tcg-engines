import type { CharacterCard } from "@tcg/lorcana-types";

export const grandDukeAdvisorToTheKing: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
      },
      id: "126-1",
      text: "YES, YOUR MAJESTY Your Prince, Princess, King, and Queen characters get +1 {S}.",
      type: "static",
    },
  ],
  cardNumber: 9,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "89bc563db548c9dd14225a733168ff2128347893",
  },
  franchise: "Cinderella",
  fullName: "Grand Duke - Advisor to the King",
  id: "126",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Grand Duke",
  set: "002",
  strength: 2,
  text: "YES, YOUR MAJESTY Your Prince, Princess, King, and Queen characters get +1 {S}.",
  version: "Advisor to the King",
  willpower: 2,
};
