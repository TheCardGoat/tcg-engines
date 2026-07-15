import type { CharacterCard } from "@tcg/lorcana-types";

export const happyLivelyKnight: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "g6u-1",
      text: "BURST OF SPEED During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 191,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  cost: 1,
  externalIds: {
    ravensburger: "3a59888573730230b6c46d076009658727fb43a8",
  },
  franchise: "Snow White",
  fullName: "Happy - Lively Knight",
  id: "g6u",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Happy",
  set: "005",
  strength: 2,
  text: "BURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Lively Knight",
  willpower: 1,
};
