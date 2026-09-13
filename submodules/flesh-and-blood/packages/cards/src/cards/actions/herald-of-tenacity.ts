import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/herald-of-tenacity.generated.ts";
import { dominate } from "../shared/keywords.ts";
import { phantasm } from "../shared/keywords.ts";

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

export const heraldOfTenacity = definePitchFamily(fabPitchFamilies["herald-of-tenacity"], {
  keywords: [dominate, phantasm],
  abilities: () => ({ ...abilities }),
});

export const {
  red: heraldOfTenacityRed,
  yellow: heraldOfTenacityYellow,
  blue: heraldOfTenacityBlue,
} = heraldOfTenacity.cards;
