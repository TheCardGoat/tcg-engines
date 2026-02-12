import type { CharacterCard } from "@tcg/lorcana-types";

export const mrsJudsonHousekeeper: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        type: "optional",
      },
      id: "1j5-1",
      name: "TIDY UP",
      text: "TIDY UP Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 153,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "c67499192d6e09bc15e8dac69e0648f8948501b8",
  },
  franchise: "Great Mouse Detective",
  fullName: "Mrs. Judson - Housekeeper",
  id: "1j5",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Mrs. Judson",
  set: "002",
  strength: 1,
  text: "TIDY UP Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.",
  version: "Housekeeper",
  willpower: 5,
};
