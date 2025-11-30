import type { CharacterCard } from "@tcg/lorcana";

export const pongoOlRascal: CharacterCard = {
  id: "37j",
  cardType: "character",
  name: "Pongo",
  version: "Ol’ Rascal",
  fullName: "Pongo - Ol’ Rascal",
  inkType: ["ruby"],
  franchise: "101 Dalmatians",
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "120",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "0b91137c16607aa4f8e758e7b1ffc78257c42cd4",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "37j-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
