import type { CharacterCard } from "@tcg/lorcana-types";

export const olafHelpingHand: CharacterCard = {
  id: "uix",
  cardType: "character",
  name: "Olaf",
  version: "Helping Hand",
  fullName: "Olaf - Helping Hand",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "010",
  text: "SECOND CHANCE When this character leaves play, you may return chosen character of yours to your hand.",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 57,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6e044f7c0be5320c2482b877967fa82a5feec15d",
  },
  abilities: [
    {
      id: "uix-1",
      type: "triggered",
      name: "SECOND CHANCE",
      trigger: {
        event: "leave-play",
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
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "SECOND CHANCE When this character leaves play, you may return chosen character of yours to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
