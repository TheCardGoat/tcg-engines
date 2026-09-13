import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/gavel-of-natural-order.generated.ts";

export const gavelOfNaturalOrder = defineCard(
  fabCardIdentitiesByCanonicalId["tpgGtDJmWntFC6QcdhhgW"],
  {
    keywords: [
      {
        name: "pairs",
        cardName: "off-hand",
      },
    ],
    abilities: {
      pairsOffHand: {
        kind: "static",
        staticKind: "meta",
        effect: {
          type: "set-status",
          status: "pairs-with-off-hand",
          target: {
            selector: "self",
          },
        },
      },
      oncePerTurnActionResourceResourceAttack: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      beginningEndPhaseRemoveAll1PowerCounters: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "end-phase",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "remove-counters",
            counter: {
              kind: "numeric",
              value: 1,
              property: "power",
            },
            count: {
              type: "all",
            },
            target: {
              selector: "self",
            },
          },
        },
      },
    },
  },
);
