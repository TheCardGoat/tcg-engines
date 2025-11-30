import type { CharacterCard } from "@tcg/lorcana";

export const ratiganCriminalMastermind: CharacterCard = {
  id: "952",
  cardType: "character",
  name: "Ratigan",
  version: "Criminal Mastermind",
  fullName: "Ratigan - Criminal Mastermind",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "091",
  cost: 4,
  strength: 4,
  willpower: 1,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "20f1cee3efa42ca0bdb7295992b0b9f485f9c40e",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "952-ability-1",
      text: "Evasive (Only characters with Evasive can challenge this character.)",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
};
