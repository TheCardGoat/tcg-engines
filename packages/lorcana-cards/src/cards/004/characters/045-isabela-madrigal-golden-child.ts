import type { CharacterCard } from "@tcg/lorcana-types";

export const isabelaMadrigalGoldenChild: CharacterCard = {
  id: "qop",
  cardType: "character",
  name: "Isabela Madrigal",
  version: "Golden Child",
  fullName: "Isabela Madrigal - Golden Child",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nLADIES FIRST During your turn, if no other character has quested this turn, this character gets +3 {L}.\nLEAVE IT TO ME Whenever this character quests, your other characters can't quest for the rest of this turn.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 45,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "602e3638bdc1ac3933b370be9d140955b16e7df6",
  },
  abilities: [
    {
      id: "qop-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "qop-2",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "no other character has quested this turn",
        },
        then: {
          type: "modify-stat",
          stat: "lore",
          modifier: 3,
          target: "SELF",
        },
      },
      text: "LADIES FIRST During your turn, if no other character has quested this turn, this character gets +3 {L}.",
    },
    {
      id: "qop-3",
      type: "triggered",
      name: "LEAVE IT TO ME",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "this-turn",
      },
      text: "LEAVE IT TO ME Whenever this character quests, your other characters can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};
