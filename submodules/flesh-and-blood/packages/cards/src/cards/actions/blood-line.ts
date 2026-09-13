import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blood-line.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const bloodLine = definePitchFamily(fabPitchFamilies["blood-line"], {
  keywords: [goAgain],
  abilities: () => ({
    costsLessPlayEachDraconicChainLinkControl: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  }),
});
export const { red: bloodLineRed } = bloodLine.cards;
