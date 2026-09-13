import { bloodDebt, goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fasting-carcass.generated.ts";
export const fastingCarcass = definePitchFamily(fabPitchFamilies["fasting-carcass"], {
  parameters: pitchMap({
    red: { color: "red" },
    yellow: { color: "yellow" },
    blue: { color: "blue" },
  }),
  keywords: [goAgain, bloodDebt],
  abilities: ({ color }) => ({
    resolutionGrantProperty: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Action"],
            },
            color: [color],
          },
        },
      },
    },
  }),
});
export const {
  red: fastingCarcassRed,
  yellow: fastingCarcassYellow,
  blue: fastingCarcassBlue,
} = fastingCarcass.cards;
