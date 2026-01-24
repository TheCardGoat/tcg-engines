import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraDreamingGuardian: CharacterCard = {
  id: "11z",
  cardType: "character",
  name: "Aurora",
  version: "Dreaming Guardian",
  fullName: "Aurora - Dreaming Guardian",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "009",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Aurora.)\nPROTECTIVE EMBRACE Your other characters gain Ward. (Opponents can't choose them except to challenge.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 153,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "88f3b49fc2874d9eb1cb392887fe8c005c52bba9",
  },
  abilities: [
    {
      id: "11z-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3 {I}",
    },
    {
      id: "11z-2",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
      name: "PROTECTIVE EMBRACE Your other",
      text: "PROTECTIVE EMBRACE Your other characters gain Ward.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
};
