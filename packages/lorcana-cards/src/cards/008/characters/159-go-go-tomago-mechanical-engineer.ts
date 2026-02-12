import type { CharacterCard } from "@tcg/lorcana-types";

export const goGoTomagoMechanicalEngineer: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "hwg-1",
      name: "NEED THIS!",
      text: "NEED THIS! When you play a Floodborn character on this card, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 159,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Inventor"],
  cost: 2,
  externalIds: {
    ravensburger: "40846eae71b4a2f0477743719c11a08182d09375",
  },
  franchise: "Big Hero 6",
  fullName: "Go Go Tomago - Mechanical Engineer",
  id: "hwg",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Go Go Tomago",
  set: "008",
  strength: 1,
  text: "NEED THIS! When you play a Floodborn character on this card, you may put the top card of your deck into your inkwell facedown and exerted.",
  version: "Mechanical Engineer",
  willpower: 3,
};
