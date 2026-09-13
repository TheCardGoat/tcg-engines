import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/riptide.generated.ts";

export const riptide = defineCard(fabCardIdentitiesByCanonicalId["DhffBQC7PHwzdJpjTjNBm"], {
  abilities: {
    firstTimeTurnPlayNonAttackActionPutHandFaceDownArsenal: {
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
            relationship: { kind: "any" },
            filter: {
              typeBox: {
                types: ["Action"],
                excludeSubtypes: ["Attack"],
              },
            },
          },
          from: ["hand"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
            to: {
              zone: "arsenal",
              visibility: "face-down",
            },
          },
        },
      },
      limit: {
        count: 1,
        per: "turn",
        ordinals: [1],
      },
    },
    wheneverTrapTriggersDeal1DamageAttacking: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "trigger",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "trigger-source",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                subtypes: ["Trap"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "generic",
          amount: 1,
          target: {
            selector: "attacking-hero",
          },
        },
      },
    },
  },
});
