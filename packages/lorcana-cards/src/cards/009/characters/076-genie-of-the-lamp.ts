import type { CharacterCard } from "@tcg/lorcana-types";

export const genieOfTheLamp: CharacterCard = {
  abilities: [
    {
      id: "msr-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "msr-2",
      text: "LET'S MAKE SOME MAGIC While this character is exerted, your other characters get +2 {S}.",
      type: "static",
    },
  ],
  cardNumber: 76,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "522b18f2666ce430ffce71fa1ab234a5c3263b59",
  },
  franchise: "Aladdin",
  fullName: "Genie - Of the Lamp",
  id: "msr",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Genie",
  set: "009",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nLET'S MAKE SOME MAGIC While this character is exerted, your other characters get +2 {S}.",
  version: "Of the Lamp",
  willpower: 3,
};
