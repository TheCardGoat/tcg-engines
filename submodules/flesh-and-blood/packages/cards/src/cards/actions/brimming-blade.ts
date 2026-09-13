import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/brimming-blade.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const brimmingBlade = definePitchFamily(fabPitchFamilies["brimming-blade"], {
  keywords: [
    {
      name: "sharpen",
    },
    goAgain,
  ],
  abilities: () => ({
    sharpenTargetSwordControlTwice: {
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
        // One declared target, sharpened twice for two +1{p} counters.
        times: 2,
        outputBinding: "it",
      },
    },
  }),
});
export const { red: brimmingBladeRed } = brimmingBlade.cards;
