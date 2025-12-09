import type { CharacterCard } from "@tcg/lorcana";

export const theNokkWaterSpirit: CharacterCard = {
  id: "q84",
  cardType: "character",
  name: "The Nokk",
  version: "Water Spirit",
  fullName: "The Nokk - Water Spirit",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "002",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 160,
  inkable: true,
  externalIds: {
    ravensburger: "5e84bd330102f933591077e27d65cdc0c3dbfdf1",
  },
  keywords: ["Ward"],
  abilities: [
    {
      id: "q84-1",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn"],
};
