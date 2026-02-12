import type { CharacterCard } from "@tcg/lorcana-types";

export const pongoDeterminedFather: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "it's a character card",
        },
        then: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        type: "conditional",
      },
      id: "1ve-1",
      text: "TWILIGHT BARK Once during your turn, you may pay 2 {I} to reveal the top card of your deck. If it's a character card, put it into your hand. Otherwise, put it on the bottom of your deck.",
      type: "action",
    },
  ],
  cardNumber: 2,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "f2e3f62dba601d0b7718e2d5a5a6d161f72cd084",
  },
  franchise: "101 Dalmatians",
  fullName: "Pongo - Determined Father",
  id: "1ve",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Pongo",
  set: "009",
  strength: 3,
  text: "TWILIGHT BARK Once during your turn, you may pay 2 {I} to reveal the top card of your deck. If it's a character card, put it into your hand. Otherwise, put it on the bottom of your deck.",
  version: "Determined Father",
  willpower: 2,
};
