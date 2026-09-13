import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/talisman-of-tithes.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const talismanOfTithes = definePitchFamily(fabPitchFamilies["talisman-of-tithes"], {
  keywords: [goAgain],
  abilities: () => ({
    opponentWouldDrawNumber1MoreDuringActionPhaseInsteadDestroyTalismanTithes: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "draw",
          player: "opponent",
        },
        modification: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "draw",
              count: {
                type: "difference",
                operands: [
                  {
                    type: "event-amount",
                  },
                  1,
                ],
              },
              player: "opponent",
            },
          ],
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { blue: talismanOfTithesBlue } = talismanOfTithes.cards;
