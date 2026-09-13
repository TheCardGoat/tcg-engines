import { boost } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heavy-metal-hardcore.generated.ts";

export const heavyMetalHardcore = definePitchFamily(fabPitchFamilies["heavy-metal-hardcore"], {
  keywords: [boost],
  abilities: () => ({
    performedThisTurnEvoBanishFromBoostModifyNumericPowerThisTurn: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "evo-banish-from-boost",
        player: "controller",
      },
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

export const {
  red: heavyMetalHardcoreRed,
  yellow: heavyMetalHardcoreYellow,
  blue: heavyMetalHardcoreBlue,
} = heavyMetalHardcore.cards;
