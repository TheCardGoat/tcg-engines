import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyDaredevil: CharacterCard = {
  abilities: [
    {
      id: "cgx-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 111,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "2cf1d9fb4a6212482783f1497e8c8a756df859b0",
  },
  fullName: "Goofy - Daredevil",
  id: "cgx",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  name: "Goofy",
  set: "001",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  version: "Daredevil",
  willpower: 4,
};
