import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rift-breaker.generated.ts";

const abilities = {
  triggeredHitDestroyLightningFlow: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "hit",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "attack",
        },
        target: {
          kind: "hero",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["permanent"],
          filter: {
            name: "Lightning Flow",
          },
          count: 1,
        },
      },
    },
  },
} as const;

export const riftBreaker = definePitchFamily(fabPitchFamilies["rift-breaker"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: riftBreakerRed,
  yellow: riftBreakerYellow,
  blue: riftBreakerBlue,
} = riftBreaker.cards;
