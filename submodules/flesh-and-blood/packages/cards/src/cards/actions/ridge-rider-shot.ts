import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ridge-rider-shot.generated.ts";
import { opt } from "../shared/keywords.ts";

const abilities = {
  triggeredMoveZoneOpt: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "move-zone",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "event-object",
          selector: "moved-object",
          relationship: {
            kind: "any",
          },
          filter: {
            hasStatus: "face-up",
          },
          bindAs: "it",
        },
        to: "arsenal",
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "opt",
        count: 1,
      },
    },
  },
} as const;

export const ridgeRiderShot = definePitchFamily(fabPitchFamilies["ridge-rider-shot"], {
  keywords: [opt(1)],
  abilities: () => ({ ...abilities }),
});

export const {
  red: ridgeRiderShotRed,
  yellow: ridgeRiderShotYellow,
  blue: ridgeRiderShotBlue,
} = ridgeRiderShot.cards;
