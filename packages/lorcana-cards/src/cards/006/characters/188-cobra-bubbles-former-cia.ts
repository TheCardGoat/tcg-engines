import type { CharacterCard } from "@tcg/lorcana-types";

export const cobraBubblesFormerCia: CharacterCard = {
  abilities: [
    {
      id: "1r8-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            amount: 1,
            chosen: true,
            target: "CONTROLLER",
            type: "discard",
          },
        ],
        type: "sequence",
      },
      id: "1r8-2",
      text: "THINK ABOUT WHAT'S BEST 2 {I} – Draw a card, then choose and discard a card.",
      type: "action",
    },
  ],
  cardNumber: 188,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "e3e47e553b80da5e66909453f91e285f5af8e7bb",
  },
  franchise: "Lilo and Stitch",
  fullName: "Cobra Bubbles - Former CIA",
  id: "1r8",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Cobra Bubbles",
  set: "006",
  strength: 3,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTHINK ABOUT WHAT'S BEST 2 {I} – Draw a card, then choose and discard a card.",
  version: "Former CIA",
  willpower: 4,
};
