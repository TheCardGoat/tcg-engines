import type { CharacterCard } from "@tcg/lorcana-types";

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
  cost: 4,
  strength: 4,
  willpower: 1,
  lore: 2,
  cardNumber: 91,
  inkable: true,
  externalIds: {
    ravensburger: "20f1cee3efa42ca0bdb7295992b0b9f485f9c40e",
  },
  abilities: [
    {
      id: "952-1",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
};
