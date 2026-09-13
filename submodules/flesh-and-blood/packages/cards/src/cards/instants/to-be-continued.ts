import { suspense } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/to-be-continued.generated.ts";

export const toBeContinued = definePitchFamily(fabPitchFamilies["to-be-continued"], {
  keywords: [suspense],
  abilities: () => ({
    firstTimeWouldBeDealtDamageEachTurnPrevent: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        times: 1,
        duration: "while-in-arena",
      },
    },
  }),
});

export const { blue: toBeContinuedBlue } = toBeContinued.cards;
