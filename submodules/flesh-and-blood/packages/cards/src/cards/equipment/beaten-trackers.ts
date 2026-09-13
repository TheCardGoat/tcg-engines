import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/beaten-trackers.generated.ts";

export const beatenTrackers = defineCard(fabCardIdentitiesByCanonicalId["zCWhR7jRCmH7D7fKDGKcF"], {
  keywords: [battleworn],
  abilities: {
    wheneverDiscardRandom6MoreMayDestroyIfDo: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "discard",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "discarded-card",
            relationship: {
              kind: "any",
            },
            filter: {
              power: {
                op: "gte",
                value: 6,
              },
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "self",
            },
          },
          then: {
            type: "gain-action-points",
            amount: 1,
          },
        },
      },
    },
  },
});
