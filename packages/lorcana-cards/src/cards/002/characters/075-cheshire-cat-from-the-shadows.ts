import type { CharacterCard } from "@tcg/lorcana-types";

export const cheshireCatFromTheShadows: CharacterCard = {
  id: "14g",
  cardType: "character",
  name: "Cheshire Cat",
  version: "From the Shadows",
  fullName: "Cheshire Cat - From the Shadows",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cheshire Cat.)\nEvasive (Only characters with Evasive can challenge this character.)\nWICKED SMILE {E} — Banish chosen damaged character.",
  cost: 8,
  strength: 5,
  willpower: 6,
  lore: 2,
  cardNumber: 75,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "91da2e177e44b0cdfd1e446b5b8aabb79e2ebafb",
  },
  abilities: [
    {
      id: "14g-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "14g-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Floodborn"],
};
