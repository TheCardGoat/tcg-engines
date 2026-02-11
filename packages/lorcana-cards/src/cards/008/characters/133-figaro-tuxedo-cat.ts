import type { CharacterCard } from "@tcg/lorcana-types";

export const figaroTuxedoCat: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      id: "1w3-1",
      text: "PLAYFULNESS Opposing items enter play exerted.",
      type: "static",
    },
  ],
  cardNumber: 133,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "f682275599ccf863e9becb5cac4f455052ec7d83",
  },
  franchise: "Pinocchio",
  fullName: "Figaro - Tuxedo Cat",
  id: "1w3",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Figaro",
  set: "008",
  strength: 3,
  text: "PLAYFULNESS Opposing items enter play exerted.",
  version: "Tuxedo Cat",
  willpower: 3,
};
