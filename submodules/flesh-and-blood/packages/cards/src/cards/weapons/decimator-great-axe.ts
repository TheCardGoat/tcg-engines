import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/decimator-great-axe.generated.ts";

export const decimatorGreatAxe = defineCard(
  fabCardIdentitiesByCanonicalId["8h7fn6dk7PfNnckbW668r"],
  {
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
      firstTimeDefendedNonEquipmentTurnHalveBaseDefenseTargetDefendingRoundedUpEndTurn: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "defender",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  excludeTypes: ["Equipment"],
                },
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "modify-numeric",
            property: "defense",
            op: "divide",
            amount: 2,
            rounding: "up",
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                defending: true,
              },
              count: 1,
            },
            duration: "this-turn",
          },
        },
        limit: {
          count: 1,
          per: "turn",
          ordinals: [1],
        },
      },
    },
  },
);
