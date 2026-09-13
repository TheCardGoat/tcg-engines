import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/illuminate.generated.ts";

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

export const illuminate = definePitchFamily(fabPitchFamilies["illuminate"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: illuminateRed,
  yellow: illuminateYellow,
  blue: illuminateBlue,
} = illuminate.cards;
