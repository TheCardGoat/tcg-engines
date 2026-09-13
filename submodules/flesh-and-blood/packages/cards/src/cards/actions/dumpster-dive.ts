import { boost } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dumpster-dive.generated.ts";

export const dumpsterDive = definePitchFamily(fabPitchFamilies["dumpster-dive"], {
  keywords: [boost],
  abilities: () => ({
    modifyNumericPower: {
      kind: "resolution",
      condition: {
        type: "or",
        conditions: [
          {
            type: "binding-matches",
            binding: "boostBanished",
            filter: { typeBox: { subtypes: ["Item"] } },
          },
          {
            type: "binding-matches",
            binding: "boostBanished",
            filter: { typeBox: { types: ["Equipment"] } },
          },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: dumpsterDiveRed,
  yellow: dumpsterDiveYellow,
  blue: dumpsterDiveBlue,
} = dumpsterDive.cards;
