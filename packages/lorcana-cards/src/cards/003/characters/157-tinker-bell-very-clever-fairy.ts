import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellVeryCleverFairy: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        type: "optional",
      },
      id: "1y4-1",
      name: "I CAN USE THAT",
      text: "I CAN USE THAT Whenever one of your items is banished, you may put that card into your inkwell facedown and exerted.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 157,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Fairy"],
  cost: 5,
  externalIds: {
    ravensburger: "fd89ea25a0c3cdeeea1cff6ca1da06b611c4a945",
  },
  franchise: "Peter Pan",
  fullName: "Tinker Bell - Very Clever Fairy",
  id: "1y4",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Tinker Bell",
  set: "003",
  strength: 3,
  text: "I CAN USE THAT Whenever one of your items is banished, you may put that card into your inkwell facedown and exerted.",
  version: "Very Clever Fairy",
  willpower: 4,
};
