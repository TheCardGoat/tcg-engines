import { dominate } from "../shared/keywords.ts";
import { fusion } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/glacial-footsteps.generated.ts";
export const glacialFootsteps = definePitchFamily(fabPitchFamilies["glacial-footsteps"], {
  keywords: [fusion("Ice"), dominate],
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
  red: glacialFootstepsRed,
  yellow: glacialFootstepsYellow,
  blue: glacialFootstepsBlue,
} = glacialFootsteps.cards;
