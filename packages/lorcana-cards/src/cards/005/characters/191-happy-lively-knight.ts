import type { CharacterCard } from "@tcg/lorcana-types";

export const happyLivelyKnight: CharacterCard = {
  id: "g6u",
  cardType: "character",
  name: "Happy",
  version: "Lively Knight",
  fullName: "Happy - Lively Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "BURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 191,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3a59888573730230b6c46d076009658727fb43a8",
  },
  abilities: [
    {
      id: "g6u-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "BURST OF SPEED During your turn, this character gains Evasive.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
};
