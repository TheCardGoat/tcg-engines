import type { CharacterCard } from "@tcg/lorcana-types";

export const pegNaturalPerformer: CharacterCard = {
  id: "wsf",
  cardType: "character",
  name: "Peg",
  version: "Natural Performer",
  fullName: "Peg - Natural Performer",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "CAPTIVE AUDIENCE {E} — If you have 3 or more other characters in play, draw a card.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 7,
  inkable: true,
  externalIds: {
    ravensburger: "762d1029f027634d776b43710b50208449173fad",
  },
  abilities: [
    {
      id: "wsf-1",
      type: "activated",
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
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
