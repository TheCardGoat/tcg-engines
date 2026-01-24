import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellVeryCleverFairy: CharacterCard = {
  id: "1y4",
  cardType: "character",
  name: "Tinker Bell",
  version: "Very Clever Fairy",
  fullName: "Tinker Bell - Very Clever Fairy",
  inkType: ["sapphire"],
  franchise: "Peter Pan",
  set: "003",
  text: "I CAN USE THAT Whenever one of your items is banished, you may put that card into your inkwell facedown and exerted.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 157,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fd89ea25a0c3cdeeea1cff6ca1da06b611c4a945",
  },
  abilities: [
    {
      id: "1y4-1",
      type: "triggered",
      name: "I CAN USE THAT",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "I CAN USE THAT Whenever one of your items is banished, you may put that card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Fairy"],
};
