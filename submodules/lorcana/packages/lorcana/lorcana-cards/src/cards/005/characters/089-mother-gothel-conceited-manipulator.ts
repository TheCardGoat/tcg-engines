import type { CharacterCard } from "@tcg/lorcana-types";
import { motherGothelConceitedManipulatorI18n } from "./089-mother-gothel-conceited-manipulator.i18n";

export const motherGothelConceitedManipulator: CharacterCard = {
  id: "GVH",
  canonicalId: "ci_GVH",
  reprints: ["set5-089"],
  cardType: "character",
  name: "Mother Gothel",
  version: "Conceited Manipulator",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "005",
  cardNumber: 89,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_209d406df9574154ad94b0b7c78d635f",
    tcgPlayer: 561631,
  },
  text: [
    {
      title: "MOTHER KNOWS BEST",
      description:
        "When you play this character, you may pay 3 {I} to return chosen character to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 3,
          },
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
  i18n: motherGothelConceitedManipulatorI18n,
};
