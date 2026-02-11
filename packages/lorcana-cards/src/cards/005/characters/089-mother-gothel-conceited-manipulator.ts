import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelConceitedManipulator: CharacterCard = {
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
      id: "1ui-1",
      name: "MOTHER KNOWS BEST",
      text: "MOTHER KNOWS BEST When you play this character, you may pay 3 {I} to return chosen character to their player's hand.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 89,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 2,
  externalIds: {
    ravensburger: "efb38f749cb6a632dcfeab1adc5d4aa4e4297a8d",
  },
  franchise: "Tangled",
  fullName: "Mother Gothel - Conceited Manipulator",
  id: "1ui",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mother Gothel",
  set: "005",
  strength: 1,
  text: "MOTHER KNOWS BEST When you play this character, you may pay 3 {I} to return chosen character to their player's hand.",
  version: "Conceited Manipulator",
  willpower: 3,
};
