import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/numbskull.generated.ts";

export const numbskull = definePitchFamily(fabPitchFamilies["numbskull"], {
  abilities: () => ({
    anyZoneResourceCostPlayPowerDefenseCantModified: {
      kind: "static",
      staticKind: "while",
      // CR 5.4.7: a self-targeted while-static functions wherever this is.
      // Do not gate that with has-status in-any-zone (no CR object status).
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "be-modified",
        subject: { selector: "self" },
        duration: "permanent",
      },
    },
  }),
});

export const { red: numbskullRed } = numbskull.cards;
