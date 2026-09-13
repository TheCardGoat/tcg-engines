import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/ez-sqeez-bookie-syndicate.generated.ts";

export const ezSqeezBookieSyndicate = defineCard(
  fabCardIdentitiesByCanonicalId.dzTtNhGMLKzQj8FpPffbB,
  {
    abilities: {
      wagerOnAttack: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
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
              },
              target: {
                kind: "hero",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "every",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "wager",
              with: {
                selector: "attack-target",
              },
              prize: {
                type: "create-token",
                token: "gold",
                controller: "winner",
                count: 2,
              },
            },
          },
        },
        label: {
          name: "wager",
        },
      },
    },
  },
);
