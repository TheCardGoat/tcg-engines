import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/fang-dracai-of-blades.generated.ts";

export const fangDracaiOfBlades = defineCard(
  fabCardIdentitiesByCanonicalId["P9DWCqqTwtKLnhNzLHnnp"],
  {
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
              types: ["Token"],
              subtypes: ["Aura"],
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
            // Parity with Young FNG001: weapon zone is required so the discount
            // applies when activating a seated dagger (before it hits the chain).
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
  },
);
