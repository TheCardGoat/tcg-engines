import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/first-tenet-of-chi-tide.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const firstTenetOfChiTide = definePitchFamily(fabPitchFamilies["first-tenet-of-chi-tide"], {
  keywords: [goAgain],
  abilities: () => ({
    nextBlueAttackTurnGets2: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            color: ["blue"],
          },
        },
      },
    },
  }),
});
export const { blue: firstTenetOfChiTideBlue } = firstTenetOfChiTide.cards;
