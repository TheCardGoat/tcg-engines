import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/fang.generated.ts";

export const fang = defineCard(fabCardIdentitiesByCanonicalId["RBcRMcBrm89m6pcTDQnP9"], {
  abilities: {
    wheneverHitMarkedCreateFealtyToken: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "marked",
            },
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
          token: "fealty",
          controller: "controller",
        },
      },
    },
    reduceDaggerAttackCostWithThreeFealty: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "zone-count",
        zone: "permanent",
        player: "controller",
        filter: {
          name: "Fealty",
          typeBox: {
            metatypes: ["Token"],
          },
        },
        comparison: {
          op: "gte",
          value: 3,
        },
      },
      effect: {
        type: "modify-activation-cost",
        op: "subtract",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          // "weapon" is required so the reduction applies at the moment a
          // Dagger attack is activated (the weapon sits in the weapon zone
          // until it enters the combat chain). Mirrors kassai (HVY091-a1)
          // Sword cost-reduction, which lists ["combat-chain","hand","weapon"].
          zones: ["combat-chain", "hand", "weapon"],
          filter: {
            typeBox: {
              subtypes: ["Dagger"],
            },
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
