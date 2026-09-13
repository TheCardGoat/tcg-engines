import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/empowering-ruckus.generated.ts";

export const empoweringRuckus = definePitchFamily(fabPitchFamilies["empowering-ruckus"], {
  abilities: () => ({
    ifVeBeenCheeredTurnGets1: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "cheered", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { yellow: empoweringRuckusYellow } = empoweringRuckus.cards;
