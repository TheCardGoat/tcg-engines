import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelConceitedManipulator: CharacterCard = {
  id: "1ui",
  cardType: "character",
  name: "Mother Gothel",
  version: "Conceited Manipulator",
  fullName: "Mother Gothel - Conceited Manipulator",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "005",
  text: "MOTHER KNOWS BEST When you play this character, you may pay 3 {I} to return chosen character to their player's hand.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 89,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "efb38f749cb6a632dcfeab1adc5d4aa4e4297a8d",
  },
  abilities: [
    {
      id: "1ui-1",
      type: "triggered",
      name: "MOTHER KNOWS BEST",
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
      text: "MOTHER KNOWS BEST When you play this character, you may pay 3 {I} to return chosen character to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
