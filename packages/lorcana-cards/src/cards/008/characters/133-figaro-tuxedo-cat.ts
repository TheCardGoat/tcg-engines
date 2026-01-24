import type { CharacterCard } from "@tcg/lorcana-types";

export const figaroTuxedoCat: CharacterCard = {
  id: "1w3",
  cardType: "character",
  name: "Figaro",
  version: "Tuxedo Cat",
  fullName: "Figaro - Tuxedo Cat",
  inkType: ["ruby"],
  franchise: "Pinocchio",
  set: "008",
  text: "PLAYFULNESS Opposing items enter play exerted.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 133,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f682275599ccf863e9becb5cac4f455052ec7d83",
  },
  abilities: [
    {
      id: "1w3-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      text: "PLAYFULNESS Opposing items enter play exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
