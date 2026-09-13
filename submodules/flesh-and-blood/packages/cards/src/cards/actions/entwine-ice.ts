import { dominate } from "../shared/keywords.ts";
import { fusion } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/entwine-ice.generated.ts";

export const entwineIce = definePitchFamily(fabPitchFamilies["entwine-ice"], {
  keywords: [fusion("Ice"), dominate],

  abilities: () => ({
    continuousGrantProperty: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: dominate,
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});
export const {
  red: entwineIceRed,
  yellow: entwineIceYellow,
  blue: entwineIceBlue,
} = entwineIce.cards;
