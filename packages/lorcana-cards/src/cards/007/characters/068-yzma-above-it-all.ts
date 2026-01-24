import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaAboveItAll: CharacterCard = {
  id: "sak",
  cardType: "character",
  name: "Yzma",
  version: "Above It All",
  fullName: "Yzma - Above It All",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "007",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Yzma.)\nEvasive (Only characters with Evasive can challenge this character.)\nBACK TO WORK Whenever another character is banished in a challenge, return that card to its player's hand, then that player discards a card at random.",
  cost: 7,
  strength: 3,
  willpower: 8,
  lore: 2,
  cardNumber: 68,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "65f8813035775940d5c4911773a0ebf5c5f20342",
  },
  abilities: [
    {
      id: "sak-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "sak-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen"],
};
