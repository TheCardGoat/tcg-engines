import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaFierceProtector: CharacterCard = {
  id: "arj",
  cardType: "character",
  name: "Raya",
  version: "Fierce Protector",
  fullName: "Raya - Fierce Protector",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  text: "DON'T CROSS ME Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 121,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "26cc86f21b2d1246e0ad32b654c821192af603c0",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};
