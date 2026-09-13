import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/burn-rubber.generated.ts";

export const burnRubber = definePitchFamily(fabPitchFamilies["burn-rubber"], {
  abilities: () => ({
    ifVeBoosted2MoreTimesTurnGets2: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "boosts-this-turn" },
        comparison: { op: "gte", value: 2 },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "defend",
            filter: {
              typeBox: {
                types: ["Equipment"],
              },
            },
            duration: "permanent",
          },
        ],
      },
    },
  }),
});
export const { red: burnRubberRed } = burnRubber.cards;
