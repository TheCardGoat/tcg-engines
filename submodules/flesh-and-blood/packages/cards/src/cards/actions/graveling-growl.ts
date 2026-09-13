import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/graveling-growl.generated.ts";

export const gravelingGrowl = definePitchFamily(fabPitchFamilies["graveling-growl"], {
  keywords: [bloodDebt],

  abilities: () => ({
    playFromBanishedWithPowerfulCard: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "banish-power-6", player: "controller" },
      playEffect: {
        role: "condition",
      },
    },
  }),
});
export const {
  red: gravelingGrowlRed,
  yellow: gravelingGrowlYellow,
  blue: gravelingGrowlBlue,
} = gravelingGrowl.cards;
