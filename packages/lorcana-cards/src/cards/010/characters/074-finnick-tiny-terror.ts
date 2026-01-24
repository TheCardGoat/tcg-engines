import type { CharacterCard } from "@tcg/lorcana-types";

export const finnickTinyTerror: CharacterCard = {
  id: "1ee",
  cardType: "character",
  name: "Finnick",
  version: "Tiny Terror",
  fullName: "Finnick - Tiny Terror",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "010",
  text: "YOU BETTER RUN When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 74,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b5aba4698df6a9e1c7d6b835744b777105c7b9f2",
  },
  abilities: [
    {
      id: "1ee-1",
      type: "triggered",
      name: "YOU BETTER RUN",
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
      text: "YOU BETTER RUN When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
