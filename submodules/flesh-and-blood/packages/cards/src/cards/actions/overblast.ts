import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/overblast.generated.ts";

export const overblast = definePitchFamily(fabPitchFamilies["overblast"], {
  abilities: () => ({
    modifyNumericPowerCountThisTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "boosts-this-combat-chain",
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: overblastRed, yellow: overblastYellow, blue: overblastBlue } = overblast.cards;
