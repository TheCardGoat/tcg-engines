import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/edict-of-steel.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const edictOfSteel = definePitchFamily(fabPitchFamilies["edict-of-steel"], {
  parameters: pitchMap({ red: 1, yellow: 2, blue: 3 }),
  keywords: [
    {
      name: "sharpen",
    },
    goAgain,
  ],
  abilities: (threshold) => ({
    resolutionSharpen: {
      kind: "resolution",
      effect: {
        type: "sharpen",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["weapon", "permanent"],
          filter: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
          count: 1,
        },
        outputBinding: "it",
      },
    },
    resolutionHasCounterCreateTokenFlurry: {
      kind: "resolution",
      condition: {
        type: "has-counter",
        counter: {
          kind: "numeric",
          value: threshold,
          property: "power",
        },
        target: {
          selector: "binding",
          binding: "it",
        },
        comparison: {
          op: "gte",
          value: threshold,
        },
      },
      effect: {
        type: "create-token",
        token: "flurry",
        controller: "controller",
      },
    },
  }),
});
export const {
  red: edictOfSteelRed,
  yellow: edictOfSteelYellow,
  blue: edictOfSteelBlue,
} = edictOfSteel.cards;
