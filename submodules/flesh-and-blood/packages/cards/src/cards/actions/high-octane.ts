import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/high-octane.generated.ts";

export const highOctane = definePitchFamily(fabPitchFamilies["high-octane"], {
  keywords: [goAgain],
  abilities: () => ({
    wheneverBoostTurnGain1ActionPoint: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "boost",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-action-points",
          amount: 1,
        },
      },
    },
    draw: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});

export const { red: highOctaneRed } = highOctane.cards;
