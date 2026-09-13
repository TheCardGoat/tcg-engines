import { stealth } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/reaper-s-call.generated.ts";

export const reaperSCall = definePitchFamily(fabPitchFamilies["reaper-s-call"], {
  keywords: [stealth],

  abilities: () => ({
    instantDiscardSelfMark: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "mark",
        target: {
          selector: "opponent",
        },
      },
    },
  }),
});
export const {
  red: reaperSCallRed,
  yellow: reaperSCallYellow,
  blue: reaperSCallBlue,
} = reaperSCall.cards;
