import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseMusketeerChampion: CharacterCard = {
  id: "1kb",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Musketeer Champion",
  fullName: "Minnie Mouse - Musketeer Champion",
  inkType: ["amber"],
  set: "004",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nDRAMATIC ENTRANCE When you play this character, banish chosen opposing character with 5 {S} or more.",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 17,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cafbe429486948b0c90695e0d88422c1815a0ad8",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
};
