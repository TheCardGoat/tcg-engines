import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraDreamingGuardian: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "11z-1",
      keyword: "Shift",
      text: "Shift 3 {I}",
      type: "keyword",
    },
    {
      effect: {
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "11z-2",
      name: "PROTECTIVE EMBRACE Your other",
      text: "PROTECTIVE EMBRACE Your other characters gain Ward.",
      type: "static",
    },
  ],
  cardNumber: 153,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "88f3b49fc2874d9eb1cb392887fe8c005c52bba9",
  },
  franchise: "Sleeping Beauty",
  fullName: "Aurora - Dreaming Guardian",
  id: "11z",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Aurora",
  set: "009",
  strength: 3,
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Aurora.)\nPROTECTIVE EMBRACE Your other characters gain Ward. (Opponents can't choose them except to challenge.)",
  version: "Dreaming Guardian",
  willpower: 5,
};
