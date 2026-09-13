import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/doubling-season.generated.ts";

export const doublingSeason = definePitchFamily(fabPitchFamilies["doubling-season"], {
  abilities: () => ({
    whileIsFaceUpAnyZoneIfWouldGain: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "face-up-in-any-zone",
      },
      effect: {
        type: "rule-modification",
        mode: "amplify",
        action: "gain-power",
        amount: 1,
        subject: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});
export const { red: doublingSeasonRed } = doublingSeason.cards;
