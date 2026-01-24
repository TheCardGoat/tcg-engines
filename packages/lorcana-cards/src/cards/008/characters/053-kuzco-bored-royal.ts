import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoBoredRoyal: CharacterCard = {
  id: "p9g",
  cardType: "character",
  name: "Kuzco",
  version: "Bored Royal",
  fullName: "Kuzco - Bored Royal",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "008",
  text: "LLAMA BREATH When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
  cost: 4,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 53,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5b0c28646183ce47d445aeed071dfcb2ce90491c",
  },
  abilities: [
    {
      id: "p9g-1",
      type: "triggered",
      name: "LLAMA BREATH",
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
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "LLAMA BREATH When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "King"],
};
