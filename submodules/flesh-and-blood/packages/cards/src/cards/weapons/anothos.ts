import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/anothos.generated.ts";

export const anothos = defineCard(fabCardIdentitiesByCanonicalId["BFWbnQjgKgRBjw88jK8KH"], {
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
    there2MoreCost3GreaterPitchZoneAnothos2Power: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "zone-count",
        zone: "pitch",
        player: "controller",
        filter: {
          numeric: [
            {
              property: "cost",
              basis: "base",
              comparison: { op: "gte", value: 3 },
            },
          ],
        },
        comparison: {
          op: "gte",
          value: 2,
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
        duration: "this-turn",
      },
    },
  },
});
