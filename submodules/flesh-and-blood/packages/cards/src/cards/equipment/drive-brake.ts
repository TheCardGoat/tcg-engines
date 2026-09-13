import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/drive-brake.generated.ts";

export const driveBrake = defineCard(fabCardIdentitiesByCanonicalId["GjBLFNBbqRDNHcgKcFnnP"], {
  keywords: [battleworn],
  abilities: {
    wheneverBanishHyperDriverFromBoostingRemove1Counter: {
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
              hasStatus: "from-boosting",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "remove-counters",
          counter: {
            kind: "numeric",
            value: -1,
            property: "defense",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
    },
  },
});
