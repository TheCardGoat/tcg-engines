import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blade-rush.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const bladeRush = definePitchFamily(fabPitchFamilies["blade-rush"], {
  keywords: [goAgain],
  abilities: () => ({
    firstSwordAttackTurnGetsGoAgain: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
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
          ordinal: 1,
        },
      },
    },
    secondSwordAttackTurnGets1: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
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
          ordinal: 2,
        },
      },
    },
  }),
});
export const { yellow: bladeRushYellow } = bladeRush.cards;
