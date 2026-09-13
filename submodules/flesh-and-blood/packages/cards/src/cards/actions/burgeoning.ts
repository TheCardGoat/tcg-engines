import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/burgeoning.generated.ts";

export const burgeoning = definePitchFamily(fabPitchFamilies["burgeoning"], {
  abilities: () => ({
    staticContinuousPlayedModifyNumericPower: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "played-this",
        per: "turn",
        onlySource: true,
        filter: { playedFromZones: ["arsenal"] },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});

export const {
  red: burgeoningRed,
  yellow: burgeoningYellow,
  blue: burgeoningBlue,
} = burgeoning.cards;
