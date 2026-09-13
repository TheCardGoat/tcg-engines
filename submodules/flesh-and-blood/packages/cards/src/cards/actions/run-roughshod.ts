import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/run-roughshod.generated.ts";

export const runRoughshod = definePitchFamily(fabPitchFamilies["run-roughshod"], {
  abilities: () => ({
    playOnlyDiscarded6MorePowerTurn: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "discard-power-6", player: "controller" },
      playEffect: {
        role: "condition",
      },
    },
  }),
});

export const { blue: runRoughshodBlue } = runRoughshod.cards;
