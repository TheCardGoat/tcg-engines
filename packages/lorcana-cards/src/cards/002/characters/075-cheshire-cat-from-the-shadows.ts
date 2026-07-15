import type { CharacterCard } from "@tcg/lorcana-types";

export const cheshireCatFromTheShadows: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "14g-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      id: "14g-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 75,
  cardType: "character",
  classifications: ["Floodborn"],
  cost: 8,
  externalIds: {
    ravensburger: "91da2e177e44b0cdfd1e446b5b8aabb79e2ebafb",
  },
  franchise: "Alice in Wonderland",
  fullName: "Cheshire Cat - From the Shadows",
  id: "14g",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Cheshire Cat",
  set: "002",
  strength: 5,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cheshire Cat.)\nEvasive (Only characters with Evasive can challenge this character.)\nWICKED SMILE {E} — Banish chosen damaged character.",
  version: "From the Shadows",
  willpower: 6,
};
