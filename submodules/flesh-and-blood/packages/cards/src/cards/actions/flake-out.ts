import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/flake-out.generated.ts";
import { dominate } from "../shared/keywords.ts";
export const flakeOut = definePitchFamily(fabPitchFamilies["flake-out"], {
  parameters: pitchMap({ red: {}, yellow: {}, blue: {} }),
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
export const { red: flakeOutRed, yellow: flakeOutYellow, blue: flakeOutBlue } = flakeOut.cards;
