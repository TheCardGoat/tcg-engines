import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoBoredRoyal: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "p9g-1",
      name: "LLAMA BREATH",
      text: "LLAMA BREATH When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 53,
  cardType: "character",
  classifications: ["Storyborn", "King"],
  cost: 4,
  externalIds: {
    ravensburger: "5b0c28646183ce47d445aeed071dfcb2ce90491c",
  },
  franchise: "Emperors New Groove",
  fullName: "Kuzco - Bored Royal",
  id: "p9g",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Kuzco",
  set: "008",
  strength: 1,
  text: "LLAMA BREATH When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
  version: "Bored Royal",
  willpower: 3,
};
