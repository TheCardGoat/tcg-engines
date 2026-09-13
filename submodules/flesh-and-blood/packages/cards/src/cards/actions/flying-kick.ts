import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/flying-kick.generated.ts";
const abilities = {
  whileModifyNumericPower: {
    kind: "static",
    staticKind: "while",
    condition: {
      type: "chain-link-count",
      comparison: {
        op: "gte",
        value: 3,
      },
    },
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 2,
      target: {
        selector: "self",
      },
      duration: "permanent",
    },
  },
} as const;
export const flyingKick = definePitchFamily(fabPitchFamilies["flying-kick"], {
  keywords: [],
  abilities: () => ({ ...abilities }),
});
export const {
  red: flyingKickRed,
  yellow: flyingKickYellow,
  blue: flyingKickBlue,
} = flyingKick.cards;
