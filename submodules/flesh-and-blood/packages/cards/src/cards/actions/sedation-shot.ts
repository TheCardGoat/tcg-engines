import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sedation-shot.generated.ts";

const abilities = {
  continuousModifyNumeric: {
    kind: "static",
    staticKind: "continuous",
    condition: {
      type: "has-counter",
      counter: {
        kind: "named",
        name: "aim",
      },
      target: {
        selector: "self",
      },
    },
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 1,
      target: {
        selector: "self",
      },
      duration: "permanent",
    },
  },
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
        type: "create-token",
        token: "inertia",
        creator: "effect-controller",
        controller: "attack-target",
      },
    },
  },
} as const;

export const sedationShot = definePitchFamily(fabPitchFamilies["sedation-shot"], {
  abilities: () => abilities,
});

export const {
  red: sedationShotRed,
  yellow: sedationShotYellow,
  blue: sedationShotBlue,
} = sedationShot.cards;
