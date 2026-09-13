import { suspense } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/what-happens-next.generated.ts";

export const whatHappensNext = definePitchFamily(fabPitchFamilies["what-happens-next"], {
  keywords: [suspense],
  abilities: () => ({
    firstCost1MorePlayEachTurnCostsLess: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "while-in-arena",
        appliesTo: {
          next: {
            cost: {
              op: "gte",
              value: 1,
            },
          },
        },
      },
    },
  }),
});

export const { blue: whatHappensNextBlue } = whatHappensNext.cards;
