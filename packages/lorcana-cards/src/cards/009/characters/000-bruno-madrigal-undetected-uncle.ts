import type { CharacterCard } from "@tcg/lorcana-types";

export const brunoMadrigalUndetectedUncle: CharacterCard = {
  id: "13f",
  cardType: "character",
  name: "Bruno Madrigal",
  version: "Undetected Uncle",
  fullName: "Bruno Madrigal - Undetected Uncle",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nYOU JUST HAVE TO SEE IT {E} — Name a card, then reveal the top card of your deck. If it's the named card, put it into your hand and gain 3 lore. Otherwise, put it on the top of your deck.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 0,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8e24ab30f09c8360406993a9858aa903948fec1c",
  },
  abilities: [
    {
      id: "13f-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "13f-2",
      type: "activated",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "it's the named card",
        },
        then: {
          type: "gain-lore",
          amount: 3,
        },
      },
      text: "YOU JUST HAVE TO SEE IT {E} — Name a card, then reveal the top card of your deck. If it's the named card, put it into your hand and gain 3 lore. Otherwise, put it on the top of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};
