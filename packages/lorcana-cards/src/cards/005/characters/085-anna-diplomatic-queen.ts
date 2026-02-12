import type { CharacterCard } from "@tcg/lorcana-types";

export const annaDiplomaticQueen: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "1k2-2",
      text: "• Each opponent chooses and discards a card.",
      type: "action",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "1k2-3",
      text: "• Chosen character gets +2 {S} this turn.",
      type: "action",
    },
  ],
  cardNumber: 85,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Queen"],
  cost: 3,
  externalIds: {
    ravensburger: "ccc44e0dfdc4c493db2af13ca258445a6e8d8e7b",
  },
  franchise: "Frozen",
  fullName: "Anna - Diplomatic Queen",
  id: "1k2",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Anna",
  set: "005",
  strength: 2,
  text: "ROYAL RESOLUTION When you play this character, you may pay 2 {I} to choose one: \n• Each opponent chooses and discards a card. \n• Chosen character gets +2 {S} this turn. \n• Banish chosen damaged character.",
  version: "Diplomatic Queen",
  willpower: 3,
};
