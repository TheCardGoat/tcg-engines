import { goAgain } from "../shared/keywords.ts";
import { fusion } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/entwine-lightning.generated.ts";

/** Model notes (hand-authored): go again is only the fused branch, not a static keyword. */

export const entwineLightning = definePitchFamily(fabPitchFamilies["entwine-lightning"], {
  keywords: [fusion("Lightning")],

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
  red: entwineLightningRed,
  yellow: entwineLightningYellow,
  blue: entwineLightningBlue,
} = entwineLightning.cards;
