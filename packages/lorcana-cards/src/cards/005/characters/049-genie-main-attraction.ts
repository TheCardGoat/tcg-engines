import type { CharacterCard } from "@tcg/lorcana-types";

export const genieMainAttraction: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
      id: "1ia-1",
      text: "PHENOMENAL SHOWMAN While this character is exerted, opposing characters can't ready at the start of their turn.",
      type: "static",
    },
  ],
  cardNumber: 49,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 7,
  externalIds: {
    ravensburger: "c3a3e22a3dc8e185181d63b0572644983c11e23a",
  },
  franchise: "Aladdin",
  fullName: "Genie - Main Attraction",
  id: "1ia",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Genie",
  set: "005",
  strength: 5,
  text: "PHENOMENAL SHOWMAN While this character is exerted, opposing characters can't ready at the start of their turn.",
  version: "Main Attraction",
  willpower: 5,
};
