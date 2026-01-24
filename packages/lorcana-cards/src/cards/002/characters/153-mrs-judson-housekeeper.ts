import type { CharacterCard } from "@tcg/lorcana-types";

export const mrsJudsonHousekeeper: CharacterCard = {
  id: "1j5",
  cardType: "character",
  name: "Mrs. Judson",
  version: "Housekeeper",
  fullName: "Mrs. Judson - Housekeeper",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "TIDY UP Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 153,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "c67499192d6e09bc15e8dac69e0648f8948501b8",
  },
  abilities: [
    {
      id: "1j5-1",
      type: "triggered",
      name: "TIDY UP",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "TIDY UP Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
