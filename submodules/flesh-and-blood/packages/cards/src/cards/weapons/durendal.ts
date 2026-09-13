import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/durendal.generated.ts";

export const durendal = defineCard(fabCardIdentitiesByCanonicalId["gzLPbbGKHBB9fKJdkGdJg"], {
  abilities: {
    oncePerTurnActionResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    weakenDefendingReactionsWithPowerCounter: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-counter",
        counter: {
          kind: "numeric",
          value: 1,
          property: "power",
        },
        target: {
          selector: "self",
        },
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "subtract",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["combat-chain"],
          filter: {
            // "reaction cards" = Attack Reaction or Defense Reaction
            // type-line (types:["Reaction"] never matches — same bug as the
            // OUT005 nerve-scalpel family, §7 FIXED 2026-08-08).
            or: [
              {
                typeBox: {
                  types: ["Attack Reaction"],
                },
              },
              {
                typeBox: {
                  types: ["Defense Reaction"],
                },
              },
            ],
            defending: true,
          },
          count: {
            type: "all",
          },
        },
        duration: "while-condition",
      },
    },
  },
});
