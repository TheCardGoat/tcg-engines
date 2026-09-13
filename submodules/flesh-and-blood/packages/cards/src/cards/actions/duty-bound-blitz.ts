import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/duty-bound-blitz.generated.ts";
import { goAgain } from "../shared/keywords.ts";
const abilities = {
  playAfterYellowCardEntersSoul: {
    kind: "static",
    staticKind: "play",
    condition: { type: "performed-this-turn", event: "yellow-into-soul", player: "controller" },
    playEffect: {
      role: "condition",
    },
  },
} as const;
export const dutyBoundBlitz = definePitchFamily(fabPitchFamilies["duty-bound-blitz"], {
  keywords: [goAgain],
  abilities: () => ({ ...abilities }),
});
export const {
  red: dutyBoundBlitzRed,
  yellow: dutyBoundBlitzYellow,
  blue: dutyBoundBlitzBlue,
} = dutyBoundBlitz.cards;
