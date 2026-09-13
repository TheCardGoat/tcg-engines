import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/tuffnut.generated.ts";

export const tuffnut = defineCard(fabCardIdentitiesByCanonicalId["wKnhnNTHKHqFfjgdn9LLP"], {
  abilities: {
    instantTapPitchTopDeck6MorePowerCrowdCheers: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      effect: {
        type: "sequence",
        steps: [
          // Canonical pitch of deck-top (not a silent zone move) so pitch
          // subscribers and resource generation share one path with hand pitch.
          {
            type: "pitch-card",
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
              type: "binding-matches",
              binding: "it",
              filter: {
                power: {
                  op: "gte",
                  value: 6,
                },
              },
            },
            then: {
              type: "crowd-cheers",
              target: "controller",
            },
          },
        ],
      },
    },
    wheneverCrowdCheersCreateToughnessToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "crowd-cheers",
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
          type: "create-token",
          token: "toughness",
          controller: "controller",
        },
      },
    },
  },
});
