import type { CharacterCard } from "@tcg/lorcana-types";

export const kitCloudkickerToughGuy: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "c40-1",
      name: "SKYSURFING",
      text: "SKYSURFING When you play this character, you may return chosen opposing character with 2 {S} or less to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 77,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "2ba6592b2078506e7c5389f3ec79be99fb7ce9be",
  },
  franchise: "Talespin",
  fullName: "Kit Cloudkicker - Tough Guy",
  id: "c40",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Kit Cloudkicker",
  set: "003",
  strength: 2,
  text: "SKYSURFING When you play this character, you may return chosen opposing character with 2 {S} or less to their player's hand.",
  version: "Tough Guy",
  willpower: 2,
};
