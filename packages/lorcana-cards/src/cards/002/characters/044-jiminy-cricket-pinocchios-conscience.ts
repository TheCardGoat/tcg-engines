import type { CharacterCard } from "@tcg/lorcana-types";

export const jiminyCricketPinocchiosConscience: CharacterCard = {
  id: "tfc",
  cardType: "character",
  name: "Jiminy Cricket",
  version: "Pinocchio's Conscience",
  fullName: "Jiminy Cricket - Pinocchio's Conscience",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nTHAT STILL, SMALL VOICE When you play this character, if you have a character named Pinocchio in play, you may draw a card.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 44,
  inkable: true,
  externalIds: {
    ravensburger: "6a0e1c5bd5e10ee679a0aaa9eb92ba73c5bafe57",
  },
  abilities: [
    {
      id: "tfc-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "tfc-2",
      text: "THAT STILL, SMALL VOICE When you play this character, if you have a character named Pinocchio in play, you may draw a card.",
      name: "THAT STILL, SMALL VOICE",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-named-character",
          name: "Pinocchio in play",
          controller: "you",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};
