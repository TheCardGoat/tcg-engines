import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/browbeat.generated.ts";

export const browbeat = definePitchFamily(fabPitchFamilies["browbeat"], {
  abilities: () => ({
    gets1EachHand: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "cards-in-hand",
          player: "controller",
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  }),
});
export const { blue: browbeatBlue } = browbeat.cards;
