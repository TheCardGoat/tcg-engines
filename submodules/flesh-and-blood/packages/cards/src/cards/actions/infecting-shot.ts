import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/infecting-shot.generated.ts";

const abilities = {
  continuousHasCounterAimModifyNumericPowerPermanent: {
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
  triggeredHitCreateTokenBloodrotPox: {
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
        token: "bloodrot-pox",
        controller: "attack-target",
      },
    },
  },
} as const;

export const infectingShot = definePitchFamily(fabPitchFamilies["infecting-shot"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: infectingShotRed,
  yellow: infectingShotYellow,
  blue: infectingShotBlue,
} = infectingShot.cards;
