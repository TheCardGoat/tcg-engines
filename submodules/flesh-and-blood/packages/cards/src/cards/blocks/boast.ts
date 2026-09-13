import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/boast.generated.ts";

export const boast = definePitchFamily(fabPitchFamilies.boast, {
  abilities: () => ({
    clashDefense: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: { type: "double", operands: [{ type: "count", what: "clashes-won-this-turn" }] },
        target: { selector: "self" },
        duration: "permanent",
      },
    },
  }),
});

export const { blue: boastBlue } = boast.cards;
