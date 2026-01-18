import type { CharacterCard } from "@tcg/lorcana-types";

export const grumpySkepticalKnight: CharacterCard = {
  id: "pqh",
  cardType: "character",
  name: "Grumpy",
  version: "Skeptical Knight",
  fullName: "Grumpy - Skeptical Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "BOON OF RESILIENCE While one of your Knight characters is at a location, that character gains Resist +2. (Damage dealt to them is reduced by 2.)\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 3,
  strength: 3,
  willpower: 1,
  lore: 1,
  cardNumber: 186,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5cc0f712cdf1add499e1fd33c027af155c88d367",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
};
