import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaAboveItAll: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "sak-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      id: "sak-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 68,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Queen"],
  cost: 7,
  externalIds: {
    ravensburger: "65f8813035775940d5c4911773a0ebf5c5f20342",
  },
  franchise: "Emperors New Groove",
  fullName: "Yzma - Above It All",
  id: "sak",
  inkType: ["amethyst", "emerald"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Yzma",
  set: "007",
  strength: 3,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Yzma.)\nEvasive (Only characters with Evasive can challenge this character.)\nBACK TO WORK Whenever another character is banished in a challenge, return that card to its player's hand, then that player discards a card at random.",
  version: "Above It All",
  willpower: 8,
};
