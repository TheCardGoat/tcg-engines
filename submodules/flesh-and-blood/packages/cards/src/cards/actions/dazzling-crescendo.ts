import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dazzling-crescendo.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const dazzlingCrescendo = definePitchFamily(fabPitchFamilies["dazzling-crescendo"], {
  parameters: pitchMap({ red: {}, yellow: {}, blue: {} }),
  keywords: [fusion("Lightning"), goAgain],
  abilities: () => ({
    staticContinuousHasStatusFusedGrantProperty: {
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
          keyword: goAgain,
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
  red: dazzlingCrescendoRed,
  yellow: dazzlingCrescendoYellow,
  blue: dazzlingCrescendoBlue,
} = dazzlingCrescendo.cards;
