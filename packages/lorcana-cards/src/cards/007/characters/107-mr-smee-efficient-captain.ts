import type { CharacterCard } from "@tcg/lorcana-types";

export const mrSmeeEfficientCaptain: CharacterCard = {
  id: "1co",
  cardType: "character",
  name: "Mr. Smee",
  version: "Efficient Captain",
  fullName: "Mr. Smee - Efficient Captain",
  inkType: ["emerald", "steel"],
  franchise: "Peter Pan",
  set: "007",
  text: "PIPE UP THE CREW Whenever you play an action that isn't a song, you may ready chosen Pirate character.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 107,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "af71eddc1279e3c929451e656d1d9c68d307965e",
  },
  abilities: [
    {
      id: "1co-1",
      type: "triggered",
      name: "PIPE UP THE CREW",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "ready",
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
      text: "PIPE UP THE CREW Whenever you play an action that isn't a song, you may ready chosen Pirate character.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
};
