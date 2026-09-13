import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/and-again.generated.ts";

export const andAgain = definePitchFamily(fabPitchFamilies["and-again"], {
  abilities: () => ({
    attackTargetSwordHasBeenSharpenedVeAttackedTurn: {
      kind: "resolution",
      effect: {
        type: "attack-with",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["weapon"],
          filter: {
            typeBox: {
              subtypes: ["Sword"],
            },
            and: [{ hasStatus: "sharpened" }, { hasStatus: "attacked-with-this" }],
          },
          count: 1,
        },
      },
      label: {
        name: "attack",
      },
    },
  }),
});
export const { blue: andAgainBlue } = andAgain.cards;
