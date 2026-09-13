import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/flittering-spike.generated.ts";
const abilities = {
  continuousModifyNumericPower: {
    kind: "static",
    staticKind: "continuous",
    condition: {
      type: "played-this",
      per: "chain-link",
      filter: {
        typeBox: {
          types: ["Instant"],
        },
      },
      comparison: {
        op: "gte",
        value: 1,
      },
    },
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 2,
      target: {
        selector: "self",
      },
      duration: "while-in-arena",
    },
  },
  onHitCreateTokenLightningFlow: {
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
        type: "create-token",
        token: "lightning-flow",
        controller: "controller",
      },
    },
  },
} as const;
export const flitteringSpike = definePitchFamily(fabPitchFamilies["flittering-spike"], {
  abilities: () => ({ ...abilities }),
});
export const {
  red: flitteringSpikeRed,
  yellow: flitteringSpikeYellow,
  blue: flitteringSpikeBlue,
} = flitteringSpike.cards;
