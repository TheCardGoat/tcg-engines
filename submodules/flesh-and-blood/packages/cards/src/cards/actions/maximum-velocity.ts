import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/maximum-velocity.generated.ts";

/** Model notes (hand-authored): play only if boosted 3+ times this turn. */
export const maximumVelocity = definePitchFamily(fabPitchFamilies["maximum-velocity"], {
  abilities: () => ({
    playOnlyBoosted3MoreTimesTurn: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "boosts-this-turn" },
        comparison: { op: "gte", value: 3 },
      },
      playEffect: {
        role: "condition",
      },
    },
  }),
});

export const { red: maximumVelocityRed } = maximumVelocity.cards;
