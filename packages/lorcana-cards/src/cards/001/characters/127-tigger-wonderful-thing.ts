import type { CharacterCard } from "@tcg/lorcana";

export const tiggerWonderfulThing: CharacterCard = {
  id: "1cg",
  cardType: "character",
  name: "Tigger",
  version: "Wonderful Thing",
  fullName: "Tigger - Wonderful Thing",
  inkType: ["ruby"],
  franchise: "Winnie the Pooh",
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 127,
  inkable: true,
  externalIds: {
    ravensburger: "aeb12d5f9810897355e57f169ef318f584e11c64",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "1cg-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Tigger"],
};
