import { traverse } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/viserai-between-worlds.generated.ts";

export const viseraiBetweenWorlds = defineCard(
  fabCardIdentitiesByCanonicalId["zggWCkTJQgBjj7FCDTwmQ"],
  {
    keywords: [traverse],
    abilities: {
      wheneverCreate1MoreRunechantsBanishTopDeckThenCreated3MoreRunechantsTurnTraverse: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "create",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "created-object",
              relationship: {
                kind: "any",
              },
              filter: {
                name: "Runechant",
              },
            },
            amount: {
              op: "gte",
              value: 1,
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["deck"],
                  position: "top",
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "conditional",
                condition: {
                  type: "compare-amount",
                  amount: { type: "count", what: "runechants-created-this-turn" },
                  comparison: { op: "gte", value: 3 },
                },
                then: {
                  type: "transform",
                  target: {
                    selector: "self",
                  },
                  into: "traverse",
                },
              },
            ],
          },
        },
      },
    },
  },
);
