import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseWaywardSorcerer: CharacterCard = {
  id: "kuw",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Wayward Sorcerer",
  fullName: "Mickey Mouse - Wayward Sorcerer",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**ANIMATE BROOM** You pay 1 {I} less to play Broom characters.\n\n**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 51,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "kuw-1",
      text: "**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Dreamborn", "Sorcerer"],
};
