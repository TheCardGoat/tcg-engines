import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/briar-warden-of-thorns.generated.ts";

export const briarWardenOfThorns = defineCard(
  fabCardIdentitiesByCanonicalId["cjDzkKdjNrGqL9tnDc7zd"],
  {
    keywords: [
      {
        name: "essence",
        supertypes: ["Earth", "Lightning"],
      },
    ],
    abilities: {
      firstTimeAttackActionDealsDamageOpposingCreateEmbodimentEarthToken: {
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
                hasStatus: "attack-action-card-you-control",
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
            type: "create-token",
            token: "embodiment-of-earth",
            controller: "controller",
          },
        },
        limit: {
          count: 1,
          per: "turn",
          ordinals: [1],
        },
      },
      wheneverPlaySecondNonAttackActionTurnCreateEmbodimentLightningToken: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
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
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
              bindAs: "it",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "embodiment-of-lightning",
            controller: "controller",
          },
        },
        limit: {
          count: 1,
          per: "turn",
          ordinals: [2],
        },
      },
    },
  },
);
