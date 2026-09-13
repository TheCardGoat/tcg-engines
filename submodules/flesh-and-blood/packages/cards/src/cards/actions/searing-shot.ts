import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/searing-shot.generated.ts";

const abilities = {
  triggeredEffect: {
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
        type: "lose-life",
        amount: 1,
        target: {
          selector: "attack-target",
        },
      },
    },
  },
} as const;

export const searingShot = definePitchFamily(fabPitchFamilies["searing-shot"], {
  abilities: () => abilities,
});

export const {
  red: searingShotRed,
  yellow: searingShotYellow,
  blue: searingShotBlue,
} = searingShot.cards;
