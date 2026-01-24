import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsCapriciousMonarch: CharacterCard = {
  id: "qi9",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Capricious Monarch",
  fullName: "Queen of Hearts - Capricious Monarch",
  inkType: ["steel"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "OFF WITH THEIR HEADS! Whenever an opposing character is banished, you may ready this character.",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 1,
  cardNumber: 192,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5f88c9d9b2d3f07479499c3c01721501feaa1469",
  },
  abilities: [
    {
      id: "qi9-1",
      type: "triggered",
      name: "OFF WITH THEIR HEADS!",
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "OFF WITH THEIR HEADS! Whenever an opposing character is banished, you may ready this character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen"],
};
