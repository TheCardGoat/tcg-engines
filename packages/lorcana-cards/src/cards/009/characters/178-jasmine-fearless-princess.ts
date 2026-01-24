import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineFearlessPrincess: CharacterCard = {
  id: "t89",
  cardType: "character",
  name: "Jasmine",
  version: "Fearless Princess",
  fullName: "Jasmine - Fearless Princess",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "009",
  text: "TAKE THE LEAP During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nNOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  cardNumber: 178,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "69586be51cdfb17245c5bc8ebe2efac36a7431f7",
  },
  abilities: [
    {
      id: "t89-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "TAKE THE LEAP During your turn, this character gains Evasive.",
    },
    {
      id: "t89-2",
      type: "activated",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "SELF",
        value: 3,
        duration: "this-turn",
      },
      text: "NOW'S MY CHANCE Choose and discard a card — This character gains Challenger +3 this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
