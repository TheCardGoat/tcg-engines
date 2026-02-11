import type { CharacterCard } from "@tcg/lorcana-types";

export const olafHelpingHand: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      id: "uix-1",
      name: "SECOND CHANCE",
      text: "SECOND CHANCE When this character leaves play, you may return chosen character of yours to your hand.",
      trigger: {
        event: "leave-play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 57,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "6e044f7c0be5320c2482b877967fa82a5feec15d",
  },
  franchise: "Frozen",
  fullName: "Olaf - Helping Hand",
  id: "uix",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Olaf",
  set: "010",
  strength: 2,
  text: "SECOND CHANCE When this character leaves play, you may return chosen character of yours to your hand.",
  version: "Helping Hand",
  willpower: 1,
};
