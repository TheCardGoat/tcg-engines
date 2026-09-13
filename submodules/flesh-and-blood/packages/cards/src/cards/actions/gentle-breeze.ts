import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gentle-breeze.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const gentleBreeze = definePitchFamily(fabPitchFamilies["gentle-breeze"], {
  keywords: [goAgain],
  abilities: () => ({
    otherAttacksHave1Base: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "set-base",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain", "stack"],
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasStatus: "other-than-source",
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
  }),
});
export const { red: gentleBreezeRed } = gentleBreeze.cards;
