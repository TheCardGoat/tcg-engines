import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tri-shot.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const triShot = definePitchFamily(fabPitchFamilies["tri-shot"], {
  keywords: [goAgain],
  abilities: () => ({
    activateBowControlNumber2AdditionalTimesTurn: {
      kind: "resolution",
      effect: {
        type: "modify-activation-limit",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["weapon"],
          filter: {
            typeBox: {
              subtypes: ["Bow"],
            },
          },
          count: 1,
        },
        operation: "additional",
        count: 2,
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: triShotBlue } = triShot.cards;
