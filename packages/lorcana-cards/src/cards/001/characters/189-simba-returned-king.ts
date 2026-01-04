import type { CharacterCard } from "@tcg/lorcana-types";

export const simbareturnedKing: CharacterCard = {
  id: "nj8",
  cardType: "character",
  name: "Simba",
  version: "Returned King",
  fullName: "Simba - Returned King",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "001",
  text: "Challenger +4 (While challenging, this character gets +4 {S}.)\nPOUNCE During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 2,
  cardNumber: 189,
  inkable: true,
  externalIds: {
    ravensburger: "54d1da804f89e6da94d1e9a335acf6a5baa79ff5",
  },
  abilities: [
    {
      id: "nj8-1",
      text: "Challenger +4",
      type: "keyword",
      keyword: "Challenger",
      value: 4,
    },
    {
      id: "nj8-2",
      text: "POUNCE During your turn, this character gains Evasive.",
      name: "POUNCE",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "King"],
};
