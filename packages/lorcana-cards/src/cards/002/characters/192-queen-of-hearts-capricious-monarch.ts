import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsCapriciousMonarch: CharacterCard = {
  abilities: [
    {
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
      id: "qi9-1",
      name: "OFF WITH THEIR HEADS!",
      text: "OFF WITH THEIR HEADS! Whenever an opposing character is banished, you may ready this character.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 192,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Queen"],
  cost: 7,
  externalIds: {
    ravensburger: "5f88c9d9b2d3f07479499c3c01721501feaa1469",
  },
  franchise: "Alice in Wonderland",
  fullName: "Queen of Hearts - Capricious Monarch",
  id: "qi9",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Queen of Hearts",
  set: "002",
  strength: 5,
  text: "OFF WITH THEIR HEADS! Whenever an opposing character is banished, you may ready this character.",
  version: "Capricious Monarch",
  willpower: 6,
};
