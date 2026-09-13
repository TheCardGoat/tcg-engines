import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/imposing-visage.generated.ts";

/**
 * Model notes (hand-authored):
 * - Printed cost is X; catalog `cost` is numeric-only so X is the paid amount.
 * - Search filter is Aura with cost ≤ X (not a fake "cost-x-or-less" keyword).
 */
export const imposingVisage = definePitchFamily(fabPitchFamilies["imposing-visage"], {
  keywords: [goAgain],
  abilities: () => ({
    searchDeckAuraCostXLessPutArenaThenShuffleDeck: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
              cost: {
                op: "lte",
                value: { type: "x" },
              },
            },
            mayFail: true,
            to: {
              zone: "permanent",
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  }),
});

export const { blue: imposingVisageBlue } = imposingVisage.cards;
