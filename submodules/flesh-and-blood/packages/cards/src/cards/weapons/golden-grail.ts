import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/golden-grail.generated.ts";

export const goldenGrail = defineCard(fabCardIdentitiesByCanonicalId["NqpL7k7Gc78Pw6tzMNQwN"], {
  abilities: {
    oncePerTurnActionResourceResourceDestroyGoldAttackAttackWageredGets1Power: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "alternative",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          {
            class: "effect",
            type: "destroy",
            filter: {
              name: "Gold",
            },
          },
        ],
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    attackHasWageredGets1Power: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "wagered",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  },
});
