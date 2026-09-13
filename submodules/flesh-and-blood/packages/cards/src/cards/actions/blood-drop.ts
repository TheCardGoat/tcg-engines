import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blood-drop.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const bloodDrop = definePitchFamily(fabPitchFamilies["blood-drop"], {
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
export const { red: bloodDropRed } = bloodDrop.cards;
