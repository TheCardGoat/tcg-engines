import type { CharacterCard } from "@tcg/lorcana-types";

export const mrSmeeEfficientCaptain: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "1co-1",
      name: "PIPE UP THE CREW",
      text: "PIPE UP THE CREW Whenever you play an action that isn't a song, you may ready chosen Pirate character.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "action",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 107,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
  cost: 3,
  externalIds: {
    ravensburger: "af71eddc1279e3c929451e656d1d9c68d307965e",
  },
  franchise: "Peter Pan",
  fullName: "Mr. Smee - Efficient Captain",
  id: "1co",
  inkType: ["emerald", "steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Mr. Smee",
  set: "007",
  strength: 3,
  text: "PIPE UP THE CREW Whenever you play an action that isn't a song, you may ready chosen Pirate character.",
  version: "Efficient Captain",
  willpower: 3,
};
