import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaFightingPrince: CharacterCard = {
  id: "1sf",
  cardType: "character",
  name: "Simba",
  version: "Fighting Prince",
  fullName: "Simba - Fighting Prince",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "003",
  text: "STEP DOWN OR FIGHT When you play this character and whenever he banishes another character in a challenge during your turn, you may choose one: • Draw 2 cards, then choose and discard 2 cards. • Deal 2 damage to chosen character.",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 2,
  cardNumber: 192,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e836b4740f7b37d1bb09ffe4674ef38b8b93c2ed",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Prince"],
};
