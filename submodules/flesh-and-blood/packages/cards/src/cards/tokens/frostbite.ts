import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/frostbite.generated.ts";

export const frostbite = defineCard(fabCardIdentitiesByCanonicalId.GHG6KkBzPkHDnMf7hL7K7, {
  abilities: {
    increaseCardAndAbilityCosts: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "cost",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand", "stack"],
              count: {
                type: "all",
              },
            },
            duration: "while-in-arena",
          },
          {
            type: "modify-activation-cost",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              count: {
                type: "all",
              },
            },
            duration: "while-in-arena",
          },
        ],
      },
    },
    destroyAtEndPhase: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
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
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
    destroyWhenCardPlayed: {
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
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
    destroyWhenAbilityActivated: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "activate",
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
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  },
});
