import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineFearlessPrincess: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      id: "t89-1",
      text: "TAKE THE LEAP During your turn, this character gains Evasive.",
      type: "action",
    },
    {
      cost: { exert: true },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "SELF",
        value: 3,
        duration: "this-turn",
      },
      id: "t89-2",
      text: "NOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn.",
      type: "activated",
    },
  ],
  cardNumber: 178,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "69586be51cdfb17245c5bc8ebe2efac36a7431f7",
  },
  franchise: "Aladdin",
  fullName: "Jasmine - Fearless Princess",
  id: "t89",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jasmine",
  set: "009",
  strength: 3,
  text: "TAKE THE LEAP During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nNOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  version: "Fearless Princess",
  willpower: 7,
};
