import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaDreamComeTrue: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you played a Princess character this turn",
          type: "if",
        },
        then: {
          facedown: true,
          source: "hand",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "conditional",
      },
      id: "1sh-1",
      text: "WHATEVER YOU WISH FOR At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.",
      type: "action",
    },
  ],
  cardNumber: 155,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "e866de1be3c67d16a9bbd3aa5af3e00ab4bccac5",
  },
  franchise: "Cinderella",
  fullName: "Cinderella - Dream Come True",
  id: "1sh",
  inkType: ["sapphire"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Cinderella",
  set: "010",
  strength: 2,
  text: "WHATEVER YOU WISH FOR At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.",
  version: "Dream Come True",
  willpower: 3,
};
