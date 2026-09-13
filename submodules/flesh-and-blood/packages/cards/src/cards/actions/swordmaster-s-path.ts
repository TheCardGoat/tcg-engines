import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/swordmaster-s-path.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const swordmasterSPath = definePitchFamily(fabPitchFamilies["swordmaster-s-path"], {
  parameters: pitchMap({ blue: 1, red: 3, yellow: 2 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    empowerNextSwordAttack: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
        },
      },
    },
    sharpenAdditionalTime: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "sharpen",
          subject: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
        },
        modification: {
          type: "sharpen",
          target: {
            selector: "binding",
            binding: "it",
          },
          times: 1,
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
        },
      },
    },
  }),
});

export const {
  blue: swordmasterSPathBlue,
  red: swordmasterSPathRed,
  yellow: swordmasterSPathYellow,
} = swordmasterSPath.cards;
