import type { CharacterCard } from "@tcg/lorcana-types";

export const cobraBubblesFormerCia: CharacterCard = {
  id: "1r8",
  cardType: "character",
  name: "Cobra Bubbles",
  version: "Former CIA",
  fullName: "Cobra Bubbles - Former CIA",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTHINK ABOUT WHAT'S BEST 2 {I} – Draw a card, then choose and discard a card.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 188,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e3e47e553b80da5e66909453f91e285f5af8e7bb",
  },
  abilities: [
    {
      id: "1r8-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "1r8-2",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
        ],
      },
      text: "THINK ABOUT WHAT'S BEST 2 {I} – Draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
