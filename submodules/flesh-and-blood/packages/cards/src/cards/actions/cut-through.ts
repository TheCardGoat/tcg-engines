import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cut-through.generated.ts";

export const cutThrough = definePitchFamily(fabPitchFamilies["cut-through"], {
  supertypeSets: [["Assassin"], ["Ninja"]],
  abilities: () => ({
    continuousModifyNumericGrantPropertyPower: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "attacks-hit-this-combat-chain",
          filter: { typeBox: { subtypes: ["Dagger"] } },
        },
        comparison: { op: "gte", value: 1 },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    },
  }),
});
export const {
  red: cutThroughRed,
  yellow: cutThroughYellow,
  blue: cutThroughBlue,
} = cutThrough.cards;
