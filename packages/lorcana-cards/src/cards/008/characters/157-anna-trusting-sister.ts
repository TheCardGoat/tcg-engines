import type { CharacterCard } from "@tcg/lorcana-types";

export const annaTrustingSister: CharacterCard = {
  id: "8vk",
  cardType: "character",
  name: "Anna",
  version: "Trusting Sister",
  fullName: "Anna - Trusting Sister",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "008",
  text: "WE CAN DO THIS TOGETHER When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 157,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1ffe5d75cdbe8dc9ae8605c307ef56ffb430460e",
  },
  abilities: [
    {
      id: "8vk-1",
      type: "triggered",
      name: "WE CAN DO THIS TOGETHER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Elsa in play",
        },
        then: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
      },
      text: "WE CAN DO THIS TOGETHER When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen"],
};
