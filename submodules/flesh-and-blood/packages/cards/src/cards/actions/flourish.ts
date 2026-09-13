import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/flourish.generated.ts";

export const flourish = definePitchFamily(fabPitchFamilies["flourish"], {
  keywords: [goAgain],
  parameters: { blue: 2, yellow: 3 },
  abilities: (bonus) => ({
    nextTimeAttackWouldGainTurnInsteadGainsMuch: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "gain",
        },
        modification: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: bonus,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { blue: flourishBlue, yellow: flourishYellow } = flourish.cards;
