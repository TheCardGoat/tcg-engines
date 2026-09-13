import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/hyper-driver.generated.ts";

export const hyperDriver = defineCard(fabCardIdentitiesByCanonicalId.FwwCqJKcNDNMjJn9mTCgg, {
  abilities: {
    destroyWithoutSteamCounters: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "state",
        state: {
          type: "has-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          target: {
            selector: "self",
          },
          comparison: {
            op: "eq",
            value: 0,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
    removeSteamOnBoost: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "boost",
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
          type: "sequence",
          steps: [
            {
              type: "remove-counters",
              counter: {
                kind: "named",
                name: "steam",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
            {
              type: "gain-resources",
              amount: 1,
            },
          ],
        },
      },
      limit: {
        count: 1,
        per: "turn",
      },
    },
  },
});
