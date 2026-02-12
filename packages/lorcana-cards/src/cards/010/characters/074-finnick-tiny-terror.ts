import type { CharacterCard } from "@tcg/lorcana-types";

export const finnickTinyTerror: CharacterCard = {
  abilities: [
    {
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
      id: "1ee-1",
      name: "YOU BETTER RUN",
      text: "YOU BETTER RUN When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 74,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "b5aba4698df6a9e1c7d6b835744b777105c7b9f2",
  },
  franchise: "Zootropolis",
  fullName: "Finnick - Tiny Terror",
  id: "1ee",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Finnick",
  set: "010",
  strength: 1,
  text: "YOU BETTER RUN When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.",
  version: "Tiny Terror",
  willpower: 2,
};
