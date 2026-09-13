import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/entwine-earth.generated.ts";

export const entwineEarth = definePitchFamily(fabPitchFamilies["entwine-earth"], {
  keywords: [fusion("Earth")],

  abilities: () => ({
    continuousModifyNumericPower: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});
export const {
  red: entwineEarthRed,
  yellow: entwineEarthYellow,
  blue: entwineEarthBlue,
} = entwineEarth.cards;
