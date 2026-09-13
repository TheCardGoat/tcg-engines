import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/vynnset.generated.ts";

export const vynnset = defineCard(fabCardIdentitiesByCanonicalId["WhKb7MKbcDLhGThWGP8hT"], {
  abilities: {
    startTurnBanishHandCreateRunechantToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
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
          type: "if-you-do",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
            outputBinding: "it",
          },
          then: {
            type: "create-token",
            token: "runechant",
            controller: "controller",
          },
        },
      },
    },
    wheneverPlayShadowNonAttackActionPayLifeNextRunechantEffectDealDamageTurnCantPrevented: {
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
              },
              and: [
                {
                  typeBox: {
                    supertypes: ["Shadow"],
                  },
                },
                {
                  typeBox: {
                    excludeSubtypes: ["Attack"],
                  },
                },
              ],
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
            type: "pay",
            cost: {
              class: "asset",
              type: "life",
              amount: 1,
            },
            payer: "controller",
          },
          then: {
            type: "rule-modification",
            mode: "restrict",
            action: "be-prevented",
            subject: {
              name: "Runechant",
            },
            duration: "this-turn",
          },
        },
      },
    },
  },
});
