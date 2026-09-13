import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/iyslander-stormbind.generated.ts";

export const iyslanderStormbind = defineCard(
  fabCardIdentitiesByCanonicalId["8KRCDf6drqhFMKK7hJhbM"],
  {
    keywords: [
      {
        name: "essence",
        supertypes: ["Ice"],
      },
    ],
    abilities: {
      notTurnPlayBlueNonAttackActionArsenalThoughWereInstant: {
        // Same permission shape as EVR120 — static play permission, not optional
        // continuous play-card.
        kind: "static",
        staticKind: "play",
        condition: {
          type: "has-status",
          status: "not-your-turn",
        },
        playEffect: {
          role: "permission",
          fromZones: ["arsenal"],
          filter: {
            typeBox: {
              types: ["Action"],
              excludeSubtypes: ["Attack"],
            },
            color: ["blue"],
          },
          asType: "instant",
          optional: true,
        },
      },
      wheneverPlayIceDuringOpponentsTurnCreateFrostbiteToken: {
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
                  supertypes: ["Ice"],
                },
              },
              bindAs: "it",
            },
          },
          state: {
            type: "has-status",
            status: "not-your-turn",
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "frostbite",
            controller: "opponent",
          },
        },
      },
    },
  },
);
