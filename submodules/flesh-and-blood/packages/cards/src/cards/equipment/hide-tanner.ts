import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hide-tanner.generated.ts";

export const hideTanner = defineCard(fabCardIdentitiesByCanonicalId["7MNrGmWN7jTtR99LrWNm7"], {
  keywords: [battleworn],
  abilities: {
    whenDiscardRandom6MoreMayDestroyIfDo: {
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
          random: true,
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
            type: "create-token",
            token: "might",
            controller: "controller",
            count: 2,
          },
        },
      },
    },
  },
});
