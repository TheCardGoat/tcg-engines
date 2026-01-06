import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyMusketeerSwordsman: CharacterCard = {
  id: "1k3",
  cardType: "character",
  name: "Goofy",
  version: "Musketeer Swordsman",
  fullName: "Goofy - Musketeer Swordsman",
  inkType: ["amber"],
  set: "004",
  text: "EN GAWRSH! Whenever you play a character with Bodyguard, ready this character. He can't quest for the rest of this turn.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 12,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ca42513da10e6a1b0440802af06612135a6a54df",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
};
