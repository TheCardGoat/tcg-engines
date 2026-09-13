import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/katsu.generated.ts";

export const katsu = defineCard(fabCardIdentitiesByCanonicalId["QnGJNBGBFw98q9n9NCdRW"], {
  abilities: {
    firstTimeAttackActionHitsTurnDiscardCost0SearchDeckComboBanishFaceUpThenShuffleDeckPlayTurn: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: attackActionFilter(),
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          // Optional discard is the "if you do" gate: search + this-turn banished
          // play permission only run when the cost-0 discard is accepted.
          type: "optional",
          effect: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                cost: {
                  op: "eq",
                  value: 0,
                },
              },
              count: 1,
            },
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "search",
                zones: ["deck"],
                filter: {
                  hasKeyword: "combo",
                },
                mayFail: true,
                to: {
                  zone: "banished",
                },
                // Bind the tutored combo card for the follow-up play permission.
                outputBinding: "it",
              },
              {
                // Continuous this-turn play permission (not an immediate optional cast).
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            ],
          },
        },
      },
      limit: {
        count: 1,
        per: "turn",
        ordinals: [1],
      },
    },
  },
});
