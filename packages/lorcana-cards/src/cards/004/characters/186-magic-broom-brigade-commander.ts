import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomBrigadeCommander: CharacterCard = {
  id: "pct",
  cardType: "character",
  name: "Magic Broom",
  version: "Brigade Commander",
  fullName: "Magic Broom - Brigade Commander",
  inkType: ["steel"],
  franchise: "Fantasia",
  set: "004",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nARMY OF BROOMS This character gets +2 {S} for each other character named Magic Broom you have in play.",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 186,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5b62db7d0c2cf0af385d111c8e065a46ee86e2da",
  },
  abilities: [],
  classifications: ["Dreamborn", "Broom"],
};
