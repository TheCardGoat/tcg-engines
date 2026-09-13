import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/feisty-locals.generated.ts";

export const feistyLocals = definePitchFamily(fabPitchFamilies["feisty-locals"], {
  abilities: () => ({
    defendedByAction: {
      kind: "static",
      staticKind: "while",
      condition: { type: "has-status", status: "defended-by-action" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: { selector: "self" },
        duration: "permanent",
      },
    },
  }),
});

export const {
  red: feistyLocalsRed,
  yellow: feistyLocalsYellow,
  blue: feistyLocalsBlue,
} = feistyLocals.cards;
