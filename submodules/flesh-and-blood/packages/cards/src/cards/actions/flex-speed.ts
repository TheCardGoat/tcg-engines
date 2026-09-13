import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/flex-speed.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const flexSpeed = definePitchFamily(fabPitchFamilies["flex-speed"], {
  abilities: () => ({
    resolutionCompareAmountGrantProperty: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: {
          type: "subject-property",
          property: "power",
          basis: "current",
          missing: "zero",
        },
        comparison: { op: "gte", value: 6 },
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
        duration: "this-turn",
      },
    },
  }),
});
export const { red: flexSpeedRed, yellow: flexSpeedYellow, blue: flexSpeedBlue } = flexSpeed.cards;
