import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesClumsyKid: CharacterCard = {
  id: "1l5",
  cardType: "character",
  name: "Hercules",
  version: "Clumsy Kid",
  fullName: "Hercules - Clumsy Kid",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "004",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 108,
  inkable: false,
  externalIds: {
    ravensburger: "ce69a0c9df8b79208d330486269074d53266f7ac",
  },
  abilities: [
    {
      id: "1l5-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
