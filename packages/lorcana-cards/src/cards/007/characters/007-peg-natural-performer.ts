import type { CharacterCard } from "@tcg/lorcana-types";

export const pegNaturalPerformer: CharacterCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have 3 or more other characters in play",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      id: "wsf-1",
      text: "CAPTIVE AUDIENCE {E} — If you have 3 or more other characters in play, draw a card.",
      type: "activated",
    },
  ],
  cardNumber: 7,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "762d1029f027634d776b43710b50208449173fad",
  },
  franchise: "Lady and the Tramp",
  fullName: "Peg - Natural Performer",
  id: "wsf",
  inkType: ["amber", "emerald"],
  inkable: true,
  lore: 1,
  name: "Peg",
  set: "007",
  strength: 2,
  text: "CAPTIVE AUDIENCE {E} — If you have 3 or more other characters in play, draw a card.",
  version: "Natural Performer",
  willpower: 4,
};
