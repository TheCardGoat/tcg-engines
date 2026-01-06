import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckMusketeerSoldier: CharacterCard = {
  id: "1hr",
  cardType: "character",
  name: "Donald Duck",
  version: "Musketeer Soldier",
  fullName: "Donald Duck - Musketeer Soldier",
  inkType: ["amber"],
  set: "004",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nWAIT FOR ME! When you play this character, chosen character gets +1 {L} this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 8,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c1c6f67d0f2105260caa599f400e2bff4df22c37",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
};
