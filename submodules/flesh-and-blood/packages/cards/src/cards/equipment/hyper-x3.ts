import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hyper-x3.generated.ts";

export const hyperX3 = defineCard(fabCardIdentitiesByCanonicalId["WkJPkznH7gWGLmhtcmrrR"], {
  keywords: [battleworn],
  abilities: {
    wheneverBanishHyperDriverFromBoostingPutUnder: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "banish",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Hyper Driver",
              // Engine boost path stamps status marker "from-boosting" (CR 8.3.9e).
              hasStatus: "from-boosting",
            },
            // "put IT under this" — bind the observed banished driver.
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "move-card",
          target: {
            selector: "binding",
            binding: "it",
          },
          to: {
            zone: "under",
          },
        },
      },
    },
    oncePerTurnWhenHyperDriverIsPutUnder: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "move-zone",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Hyper Driver",
            },
          },
          to: "under",
        },
        state: {
          type: "compare-amount",
          amount: { type: "count", what: "objects-under-source", filter: { name: "Hyper Driver" } },
          comparison: { op: "gte", value: 3 },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
      limit: {
        count: 1,
        per: "turn",
      },
    },
  },
});
