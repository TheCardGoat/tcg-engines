import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spark-spray.generated.ts";

const abilities = {
  triggeredEffect: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "defend",
        actor: {
          kind: "player",
          player: "defending-hero",
        },
        observes: {
          kind: "source",
          selector: "defended-attack",
        },
        amount: {
          op: "gte",
          value: 1,
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "optional",
        effect: {
          type: "pay",
          cost: {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          payer: "controller",
        },
        then: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  },
} as const;

export const sparkSpray = definePitchFamily(fabPitchFamilies["spark-spray"], {
  abilities: () => abilities,
});

export const {
  red: sparkSprayRed,
  yellow: sparkSprayYellow,
  blue: sparkSprayBlue,
} = sparkSpray.cards;
