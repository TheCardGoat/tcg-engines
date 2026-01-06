import type { CharacterCard } from "@tcg/lorcana-types";

export const bambiLittlePrince: CharacterCard = {
  id: "cmx",
  cardType: "character",
  name: "Bambi",
  version: "Little Prince",
  fullName: "Bambi - Little Prince",
  inkType: ["amethyst"],
  franchise: "Bambi",
  set: "008",
  text: "SAY HELLO When you play this character, gain 1 lore.\nKIND OF BASHFUL When an opponent plays a character, return this character to your hand.",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 3,
  cardNumber: 63,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2d8b5c712524adb131cbf2e2a8bbd3c786353691",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince"],
};
