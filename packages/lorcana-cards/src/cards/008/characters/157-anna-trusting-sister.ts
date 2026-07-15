import type { CharacterCard } from "@tcg/lorcana-types";

export const annaTrustingSister: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have a character named Elsa in play",
          type: "if",
        },
        then: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "conditional",
      },
      id: "8vk-1",
      name: "WE CAN DO THIS TOGETHER",
      text: "WE CAN DO THIS TOGETHER When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 157,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Queen"],
  cost: 3,
  externalIds: {
    ravensburger: "1ffe5d75cdbe8dc9ae8605c307ef56ffb430460e",
  },
  franchise: "Frozen",
  fullName: "Anna - Trusting Sister",
  id: "8vk",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Anna",
  set: "008",
  strength: 2,
  text: "WE CAN DO THIS TOGETHER When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.",
  version: "Trusting Sister",
  willpower: 2,
};
