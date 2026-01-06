import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinGoat: CharacterCard = {
  id: "198",
  cardType: "character",
  name: "Merlin",
  version: "Goat",
  fullName: "Merlin - Goat",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "HERE I COME! When you play this character and when he leaves play, gain 1 lore.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 51,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a29eca3d8c2f7e753604eac2019e1eb7a21a01b2",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};
