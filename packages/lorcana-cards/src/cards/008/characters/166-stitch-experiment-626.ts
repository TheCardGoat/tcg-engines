import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchExperiment626: CharacterCard = {
  id: "bxo",
  cardType: "character",
  name: "Stitch",
  version: "Experiment 626",
  fullName: "Stitch - Experiment 626",
  inkType: ["sapphire"],
  franchise: "Lilo and Stitch",
  set: "008",
  text: "SO NAUGHTY When you play this character, each opponent puts the top card of their deck into their inkwell facedown and exerted.\nSTEALTH MODE At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play this character for free and he enters play exerted.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 166,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "2b044feacd5a7ab8653f088ab25e14b039ea379c",
  },
  abilities: [
    {
      id: "bxo-1",
      type: "triggered",
      name: "SO NAUGHTY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "put-into-inkwell",
        source: "hand",
        target: "OPPONENT",
        exerted: true,
        facedown: true,
      },
      text: "SO NAUGHTY When you play this character, each opponent puts the top card of their deck into their inkwell facedown and exerted.",
    },
    {
      id: "bxo-2",
      type: "static",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "this card is in your discard",
        },
        then: {
          type: "restriction",
          restriction: "enters-play-exerted",
          target: "SELF",
        },
      },
      text: "STEALTH MODE At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play this character for free and he enters play exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Alien"],
};
