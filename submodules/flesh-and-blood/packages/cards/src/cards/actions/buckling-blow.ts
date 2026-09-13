import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/buckling-blow.generated.ts";

export const bucklingBlow = definePitchFamily(fabPitchFamilies["buckling-blow"], {
  abilities: () => ({
    crush: crushAbility({
      effect: {
        type: "add-counter",
        counter: {
          kind: "numeric",
          value: -1,
          property: "defense",
        },
        count: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["permanent"],
          filter: {
            typeBox: {
              types: ["Equipment"],
            },
          },
          count: 1,
        },
      },
    }),
  }),
});
export const {
  red: bucklingBlowRed,
  yellow: bucklingBlowYellow,
  blue: bucklingBlowBlue,
} = bucklingBlow.cards;
