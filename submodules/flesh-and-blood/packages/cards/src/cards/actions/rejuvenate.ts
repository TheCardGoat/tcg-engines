import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rejuvenate.generated.ts";

export const rejuvenate = definePitchFamily(fabPitchFamilies["rejuvenate"], {
  parameters: pitchMap({
    red: { lifeGain: 3 },
    yellow: { lifeGain: 2 },
    blue: { lifeGain: 1 },
  }),
  abilities: ({ lifeGain }) => ({
    gainLife: {
      kind: "resolution",
      effect: {
        type: "gain-life",
        amount: lifeGain,
        target: {
          selector: "controller",
        },
      },
    },
    performedThisTurnFusePlayRejuvenateAsInstant: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "fuse", player: "controller" },
      playEffect: {
        role: "permission",
        fromZones: ["hand", "arsenal"],
        asType: "instant",
        optional: true,
      },
    },
  }),
});
export const {
  red: rejuvenateRed,
  yellow: rejuvenateYellow,
  blue: rejuvenateBlue,
} = rejuvenate.cards;
