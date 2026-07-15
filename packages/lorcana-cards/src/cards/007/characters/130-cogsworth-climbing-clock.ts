import type { CharacterCard } from "@tcg/lorcana-types";

export const cogsworthClimbingClock: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1th-1",
      text: "STILL USEFUL While you have an item card in your discard, this character gets +2 {S}.",
      type: "action",
    },
  ],
  cardNumber: 130,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "ebfcd72de83d8a6b13d8d56f7b949f97ff029f88",
  },
  franchise: "Beauty and the Beast",
  fullName: "Cogsworth - Climbing Clock",
  id: "1th",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Cogsworth",
  set: "007",
  strength: 3,
  text: "STILL USEFUL While you have an item card in your discard, this character gets +2 {S}.",
  version: "Climbing Clock",
  willpower: 3,
};
