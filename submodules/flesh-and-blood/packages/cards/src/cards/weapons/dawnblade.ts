import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/dawnblade.generated.ts";

export const dawnblade = defineCard(fabCardIdentitiesByCanonicalId["NDjHqNJrckK6pjK7LwfMW"], {
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
    secondTimeHitsTurnPut1PowerCounter: {
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
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "add-counter",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
      limit: {
        count: 1,
        per: "turn",
        ordinals: [2],
      },
    },
    beginningEndPhaseHasntHitTurnRemoveAll1PowerCounters: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: { type: "not", condition: { type: "has-status", status: "this-dealt-damage" } },
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
});
