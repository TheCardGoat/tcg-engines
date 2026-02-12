import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchExperiment626: CharacterCard = {
  abilities: [
    {
      effect: {
        exerted: true,
        facedown: true,
        source: "hand",
        target: "OPPONENT",
        type: "put-into-inkwell",
      },
      id: "bxo-1",
      name: "SO NAUGHTY",
      text: "SO NAUGHTY When you play this character, each opponent puts the top card of their deck into their inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        condition: {
          type: "if",
          expression: "this card is in your discard",
        },
        then: {
          type: "restriction",
          restriction: "enters-play-exerted",
          target: "SELF",
        },
        type: "conditional",
      },
      id: "bxo-2",
      text: "STEALTH MODE At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play this character for free and he enters play exerted.",
      type: "static",
    },
  ],
  cardNumber: 166,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Alien"],
  cost: 3,
  externalIds: {
    ravensburger: "2b044feacd5a7ab8653f088ab25e14b039ea379c",
  },
  franchise: "Lilo and Stitch",
  fullName: "Stitch - Experiment 626",
  id: "bxo",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Stitch",
  set: "008",
  strength: 3,
  text: "SO NAUGHTY When you play this character, each opponent puts the top card of their deck into their inkwell facedown and exerted.\nSTEALTH MODE At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play this character for free and he enters play exerted.",
  version: "Experiment 626",
  willpower: 3,
};
