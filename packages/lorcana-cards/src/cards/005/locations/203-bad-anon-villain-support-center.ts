import type { LocationCard } from "@tcg/lorcana-types";

export const badanonVillainSupportCenter: LocationCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        cardType: "character",
        cost: "free",
        from: "hand",
        type: "play-card",
      },
      id: "1kj-1",
      text: "THERE'S NO ONE I'D RATHER BE THAN ME Villain characters gain “{E}, 3 {I} — Play a character with the same name as this character for free” while here.",
      type: "activated",
    },
  ],
  cardNumber: 203,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "cc71c1618903c39c8004b62c6773737e15c61cef",
  },
  franchise: "Wreck It Ralph",
  fullName: "Bad-Anon - Villain Support Center",
  id: "1kj",
  inkType: ["steel"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Bad-Anon",
  set: "005",
  text: "THERE'S NO ONE I'D RATHER BE THAN ME Villain characters gain “{E}, 3 {I} — Play a character with the same name as this character for free” while here.",
  version: "Villain Support Center",
};
