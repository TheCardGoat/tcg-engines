import type { CharacterCard } from "@tcg/lorcana-types";

export const cogsworthGrandfatherClock: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "184-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      id: "184-2",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 1,
      },
      id: "184-3",
      name: "UNWIND Your other",
      text: "UNWIND Your other characters gain Resist +1",
      type: "static",
    },
  ],
  cardNumber: 142,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "a1c1148044f285d2b55c6344c445f396d8b4c5a2",
  },
  franchise: "Beauty and the Beast",
  fullName: "Cogsworth - Grandfather Clock",
  id: "184",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Cogsworth",
  set: "002",
  strength: 2,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Cogsworth.)\nWard (Opponents can't choose this character except to challenge.)\nUNWIND Your other characters gain Resist +1 (Damage dealt to them is reduced by 1.)",
  version: "Grandfather Clock",
  willpower: 5,
};
