import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amplifying-arrow.generated.ts";

export const amplifyingArrow = definePitchFamily(fabPitchFamilies["amplifying-arrow"], {
  abilities: () => ({
    whileAmplifyingArrowIsFaceUpAnyZoneIf: {
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
export const { yellow: amplifyingArrowYellow } = amplifyingArrow.cards;
