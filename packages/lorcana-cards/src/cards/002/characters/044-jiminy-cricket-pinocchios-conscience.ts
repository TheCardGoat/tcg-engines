import type { CharacterCard } from "@tcg/lorcana-types";

export const jiminyCricketPinocchiosConscience: CharacterCard = {
  abilities: [
    {
      id: "tfc-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        condition: {
          expression: "you have a character named Pinocchio in play",
          type: "if",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "tfc-2",
      text: "THAT STILL, SMALL VOICE When you play this character, if you have a character named Pinocchio in play, you may draw a card.",
      type: "action",
    },
  ],
  cardNumber: 44,
  cardType: "character",
  classifications: ["Storyborn", "Mentor"],
  cost: 2,
  externalIds: {
    ravensburger: "6a0e1c5bd5e10ee679a0aaa9eb92ba73c5bafe57",
  },
  franchise: "Pinocchio",
  fullName: "Jiminy Cricket - Pinocchio's Conscience",
  id: "tfc",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Jiminy Cricket",
  set: "002",
  strength: 1,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nTHAT STILL, SMALL VOICE When you play this character, if you have a character named Pinocchio in play, you may draw a card.",
  version: "Pinocchio's Conscience",
  willpower: 2,
};
