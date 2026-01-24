import type { CharacterCard } from "@tcg/lorcana-types";

export const cogsworthGrandfatherClock: CharacterCard = {
  id: "184",
  cardType: "character",
  name: "Cogsworth",
  version: "Grandfather Clock",
  fullName: "Cogsworth - Grandfather Clock",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Cogsworth.)\nWard (Opponents can't choose this character except to challenge.)\nUNWIND Your other characters gain Resist +1 (Damage dealt to them is reduced by 1.)",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 142,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a1c1148044f285d2b55c6344c445f396d8b4c5a2",
  },
  abilities: [
    {
      id: "184-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "184-2",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "184-3",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 1,
      },
      name: "UNWIND Your other",
      text: "UNWIND Your other characters gain Resist +1",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
