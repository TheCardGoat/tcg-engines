import type { CharacterCard } from "@tcg/lorcana";

export const mickeyMouseBraveLittleTailor: CharacterCard = {
  id: "a81",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Brave Little Tailor",
  fullName: "Mickey Mouse - Brave Little Tailor",
  inkType: ["ruby"],
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 8,
  strength: 5,
  willpower: 5,
  lore: 4,
  cardNumber: 115,
  inkable: true,
  externalIds: {
    ravensburger: "24d9608bc36bf0e9c6e158b0569ebcd8d0515343",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "a81-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
