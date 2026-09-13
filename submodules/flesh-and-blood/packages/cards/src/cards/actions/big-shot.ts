import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/big-shot.generated.ts";

export const bigShot = definePitchFamily(fabPitchFamilies["big-shot"], {
  abilities: () => ({
    ifVeBoosted2MoreTimesTurnGets2: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "boosts-this-turn" },
        comparison: { op: "gte", value: 2 },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: bigShotRed } = bigShot.cards;
