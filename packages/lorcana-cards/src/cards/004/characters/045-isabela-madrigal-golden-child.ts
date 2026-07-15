import type { CharacterCard } from "@tcg/lorcana-types";

export const isabelaMadrigalGoldenChild: CharacterCard = {
  abilities: [
    {
      id: "qop-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        condition: {
          expression: "no other character has quested this turn",
          type: "if",
        },
        then: {
          modifier: 3,
          stat: "lore",
          target: "SELF",
          type: "modify-stat",
        },
        type: "conditional",
      },
      id: "qop-2",
      text: "LADIES FIRST During your turn, if no other character has quested this turn, this character gets +3 {L}.",
      type: "action",
    },
    {
      effect: {
        duration: "this-turn",
        restriction: "cant-quest",
        target: "SELF",
        type: "restriction",
      },
      id: "qop-3",
      name: "LEAVE IT TO ME",
      text: "LEAVE IT TO ME Whenever this character quests, your other characters can't quest for the rest of this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 45,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 5,
  externalIds: {
    ravensburger: "602e3638bdc1ac3933b370be9d140955b16e7df6",
  },
  franchise: "Encanto",
  fullName: "Isabela Madrigal - Golden Child",
  id: "qop",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Isabela Madrigal",
  set: "004",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nLADIES FIRST During your turn, if no other character has quested this turn, this character gets +3 {L}.\nLEAVE IT TO ME Whenever this character quests, your other characters can't quest for the rest of this turn.",
  version: "Golden Child",
  willpower: 4,
};
