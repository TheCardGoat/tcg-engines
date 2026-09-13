import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/macros/treasure-island.generated.ts";

export const treasureIsland = defineCard(fabCardIdentitiesByCanonicalId.jnR9QPhTfLmGWF7TPTQgp, {
  abilities: {
    accumulateGoldCounters: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "gold",
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
        ordinals: [1],
      },
    },
    convertDamageToGold: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "damage-source",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "you-or-ally-you-control",
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
          type: "sequence",
          steps: [
            {
              type: "remove-counters",
              counter: {
                kind: "named",
                name: "gold",
              },
              count: {
                type: "event-amount",
              },
              target: {
                selector: "self",
              },
            },
            {
              type: "create-token",
              token: "gold",
              controller: "controller",
              count: {
                type: "count",
                what: "counters-removed",
              },
            },
          ],
        },
      },
    },
  },
});
