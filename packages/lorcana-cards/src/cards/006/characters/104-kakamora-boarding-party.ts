import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraBoardingParty: CharacterCard = {
  id: "7k1",
  cardType: "character",
  name: "Kakamora",
  version: "Boarding Party",
  fullName: "Kakamora - Boarding Party",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 4,
  strength: 5,
  willpower: 2,
  lore: 1,
  cardNumber: 104,
  inkable: false,
  externalIds: {
    ravensburger: "1b4a8518d45c24ba97ec36484731e8b55c085d5b",
  },
  abilities: [
    {
      id: "7k1-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Storyborn", "Pirate"],
};
