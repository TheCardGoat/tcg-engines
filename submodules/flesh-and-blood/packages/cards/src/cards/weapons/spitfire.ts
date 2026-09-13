import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/spitfire.generated.ts";

export const spitfire = defineCard(fabCardIdentitiesByCanonicalId["BfnKt6gbqBFmB6Bw6zGkd"], {
  abilities: {
    actionTapTapCogAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "tap",
            filter: {
              typeBox: {
                subtypes: ["Cog"],
              },
            },
          },
        ],
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    attacksTapCogAttackGets1Power: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "tap",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Cog"],
                },
                hasStatus: "untapped",
              },
              count: 1,
            },
          },
          then: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
          },
        },
      },
    },
  },
});
