import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/titan-s-fist.generated.ts";

export const titanSFist = defineCard(fabCardIdentitiesByCanonicalId["cTRhTc7kkHWQrwpRgtrM9"], {
  abilities: {
    oncePerTurnActionResourceResourceResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 3,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    thereCost3GreaterPitchZoneTitansFist1Power: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "conditional",
        condition: {
          type: "zone-count",
          zone: "pitch",
          player: "controller",
          filter: {
            numeric: [{ property: "cost", basis: "base", comparison: { op: "gte", value: 3 } }],
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        then: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "while-condition",
        },
      },
    },
  },
});
