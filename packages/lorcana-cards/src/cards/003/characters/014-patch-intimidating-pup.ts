import type { CharacterCard } from "@tcg/lorcana-types";

export const patchIntimidatingPup: CharacterCard = {
  id: "1p9",
  cardType: "character",
  name: "Patch",
  version: "Intimidating Pup",
  fullName: "Patch - Intimidating Pup",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "003",
  text: "BARK {E} — Chosen character gets -2 {S} until the start of your next turn.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 14,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dcd8b13bdaaf51885db54956f3a56d6f87a5f371",
  },
  abilities: [],
  classifications: ["Storyborn", "Puppy"],
};
