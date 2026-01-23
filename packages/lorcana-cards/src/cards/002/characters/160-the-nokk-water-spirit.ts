import type { CharacterCard } from "@tcg/lorcana-types";

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
  abilities: [
    {
      id: "q84-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
  ],
  classifications: ["Storyborn"],
};
