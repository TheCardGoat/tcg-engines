import type { CharacterCard } from "@tcg/lorcana-types";

export const genieOfTheLamp: CharacterCard = {
  id: "msr",
  cardType: "character",
  name: "Genie",
  version: "Of the Lamp",
  fullName: "Genie - Of the Lamp",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nLET'S MAKE SOME MAGIC While this character is exerted, your other characters get +2 {S}.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 76,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "522b18f2666ce430ffce71fa1ab234a5c3263b59",
  },
  abilities: [
    {
      id: "msr-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "msr-2",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      text: "LET'S MAKE SOME MAGIC While this character is exerted, your other characters get +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
