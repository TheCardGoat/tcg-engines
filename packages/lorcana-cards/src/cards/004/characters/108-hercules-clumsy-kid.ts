import type { CharacterCard } from "@tcg/lorcana";

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
  cardNumber: "108",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  vanilla: false,
  externalIds: {
    ravensburger: "ce69a0c9df8b79208d330486269074d53266f7ac",
  },
  keywords: ["Rush"],
  abilities: [
    {
      id: "1l5-ability-1",
      text: "Rush (This character can challenge the turn they're played.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
