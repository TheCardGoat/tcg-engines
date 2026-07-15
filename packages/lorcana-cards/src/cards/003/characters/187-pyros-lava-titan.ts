import type { CharacterCard } from "@tcg/lorcana-types";

export const pyrosLavaTitan: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "ready",
        },
        type: "optional",
      },
      id: "13y-1",
      name: "ERUPTION",
      text: "ERUPTION During your turn, whenever this character banishes another character in a challenge, you may ready chosen character.",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 187,
  cardType: "character",
  classifications: ["Storyborn", "Titan"],
  cost: 5,
  externalIds: {
    ravensburger: "8ff79abe1dc3be06d9d67421be126ceb63898677",
  },
  franchise: "Hercules",
  fullName: "Pyros - Lava Titan",
  id: "13y",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Pyros",
  set: "003",
  strength: 5,
  text: "ERUPTION During your turn, whenever this character banishes another character in a challenge, you may ready chosen character.",
  version: "Lava Titan",
  willpower: 4,
};
