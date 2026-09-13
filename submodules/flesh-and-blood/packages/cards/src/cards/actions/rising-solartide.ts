import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rising-solartide.generated.ts";

const abilities = {
  triggeredHitMoveCard: {
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
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "move-card",
        target: {
          selector: "self",
        },
        to: {
          zone: "soul",
        },
      },
    },
  },
} as const;

export const risingSolartide = definePitchFamily(fabPitchFamilies["rising-solartide"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: risingSolartideRed,
  yellow: risingSolartideYellow,
  blue: risingSolartideBlue,
} = risingSolartide.cards;
