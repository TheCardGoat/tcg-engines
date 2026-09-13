import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/alpha-instinct.generated.ts";

/** Model notes (hand-authored): trigger is this card discarded to beat chest (printed "When this is discarded to beat chest"). */
export const alphaInstinct = definePitchFamily(fabPitchFamilies["alpha-instinct"], {
  keywords: [
    {
      name: "specialization",
      hero: "Rhinar",
    },
  ],
  abilities: () => ({
    whenIsDiscardedBeatChestCreateMightToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "beat-chest",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "might",
          controller: "controller",
        },
      },
    },
  }),
});
export const { blue: alphaInstinctBlue } = alphaInstinct.cards;
