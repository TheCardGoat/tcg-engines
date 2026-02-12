import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsCapriciousMonarch: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "self",
            zones: ["play"],
          },
          type: "ready",
        },
        type: "optional",
      },
      id: "qi9-1",
      name: "OFF WITH THEIR HEADS!",
      text: "OFF WITH THEIR HEADS! Whenever an opposing character is banished, you may ready this character.",
      trigger: { event: "play", on: "SELF", timing: "when" },
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
