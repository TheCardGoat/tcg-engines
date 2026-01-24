import type { CharacterCard } from "@tcg/lorcana-types";

export const genieMainAttraction: CharacterCard = {
  id: "1ia",
  cardType: "character",
  name: "Genie",
  version: "Main Attraction",
  fullName: "Genie - Main Attraction",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  text: "PHENOMENAL SHOWMAN While this character is exerted, opposing characters can't ready at the start of their turn.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 49,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "c3a3e22a3dc8e185181d63b0572644983c11e23a",
  },
  abilities: [
    {
      id: "1ia-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
      text: "PHENOMENAL SHOWMAN While this character is exerted, opposing characters can't ready at the start of their turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
