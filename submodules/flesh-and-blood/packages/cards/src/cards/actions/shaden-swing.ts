import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shaden-swing.generated.ts";

export const shadenSwing = definePitchFamily(fabPitchFamilies["shaden-swing"], {
  keywords: [bloodDebt],

  abilities: () => ({
    playFromBanishedZone: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "hand",
          count: 1,
          random: true,
        },
      },
    },
  }),
});
export const {
  red: shadenSwingRed,
  yellow: shadenSwingYellow,
  blue: shadenSwingBlue,
} = shadenSwing.cards;
