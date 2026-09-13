import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/falcon-wing.generated.ts";
const abilities = {
  continuousModifyNumericPower: {
    kind: "static",
    staticKind: "continuous",
    condition: {
      type: "has-counter",
      counter: {
        kind: "named",
        name: "aim",
      },
      target: {
        selector: "self",
      },
    },
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 1,
      target: {
        selector: "self",
      },
      duration: "permanent",
    },
  },
} as const;
export const falconWing = definePitchFamily(fabPitchFamilies["falcon-wing"], {
  abilities: () => ({ ...abilities }),
});
export const {
  red: falconWingRed,
  yellow: falconWingYellow,
  blue: falconWingBlue,
} = falconWing.cards;
