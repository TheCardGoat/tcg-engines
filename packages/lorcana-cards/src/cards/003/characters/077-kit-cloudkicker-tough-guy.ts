import type { CharacterCard } from "@tcg/lorcana-types";

export const kitCloudkickerToughGuy: CharacterCard = {
  id: "c40",
  cardType: "character",
  name: "Kit Cloudkicker",
  version: "Tough Guy",
  fullName: "Kit Cloudkicker - Tough Guy",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "003",
  text: "SKYSURFING When you play this character, you may return chosen opposing character with 2 {S} or less to their player's hand.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 77,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2ba6592b2078506e7c5389f3ec79be99fb7ce9be",
  },
  abilities: [
    {
      id: "c40-1",
      type: "triggered",
      name: "SKYSURFING",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "SKYSURFING When you play this character, you may return chosen opposing character with 2 {S} or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
