import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/viserai-rune-blood.generated.ts";

export const viseraiRuneBlood = defineCard(
  fabCardIdentitiesByCanonicalId["TKbRWjjBLJThMmLkTFb6q"],
  {
    abilities: {
      wheneverPlayRunebladePlayedAnotherNonAttackActionTurnCreateRunechantToken: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "play",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "played-card",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  supertypes: ["Runeblade"],
                },
              },
              bindAs: "it",
            },
          },
          state: {
            type: "played-this",
            per: "turn",
            filter: { typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] } },
            comparison: { op: "gte", value: 2 },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "runechant",
            controller: "controller",
          },
        },
      },
    },
  },
);
