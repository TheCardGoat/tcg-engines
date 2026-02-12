import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelConceitedManipulator: CharacterCard = {
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
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1ui-1",
      name: "MOTHER KNOWS BEST",
      text: "MOTHER KNOWS BEST When you play this character, you may pay 3 {I} to return chosen character to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
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
