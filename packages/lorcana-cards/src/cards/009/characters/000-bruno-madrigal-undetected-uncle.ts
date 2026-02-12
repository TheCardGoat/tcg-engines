import type { CharacterCard } from "@tcg/lorcana-types";

export const brunoMadrigalUndetectedUncle: CharacterCard = {
  abilities: [
    {
      id: "13f-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      cost: { exert: true },
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
      id: "13f-2",
      text: "YOU JUST HAVE TO SEE IT {E} — Name a card, then reveal the top card of your deck. If it's the named card, put it into your hand and gain 3 lore. Otherwise, put it on the top of your deck.",
      type: "activated",
    },
  ],
  cardNumber: 0,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 4,
  externalIds: {
    ravensburger: "8e24ab30f09c8360406993a9858aa903948fec1c",
  },
  franchise: "Encanto",
  fullName: "Bruno Madrigal - Undetected Uncle",
  id: "13f",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Bruno Madrigal",
  set: "009",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nYOU JUST HAVE TO SEE IT {E} — Name a card, then reveal the top card of your deck. If it's the named card, put it into your hand and gain 3 lore. Otherwise, put it on the top of your deck.",
  version: "Undetected Uncle",
  willpower: 3,
};
