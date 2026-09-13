import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/talisman-of-recompense.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const talismanOfRecompense = definePitchFamily(fabPitchFamilies["talisman-of-recompense"], {
  keywords: [goAgain],
  abilities: () => ({
    wheneverPitchWouldGainExactlyOneResourceInsteadDestroyTalismanRecompenseGain: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "pitch",
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
              type: "gain-resources",
              amount: 2,
            },
          ],
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { yellow: talismanOfRecompenseYellow } = talismanOfRecompense.cards;
