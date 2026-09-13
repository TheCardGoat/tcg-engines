import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/zephyr-needle.generated.ts";

export const zephyrNeedle = defineCard(fabCardIdentitiesByCanonicalId["DC8RfMDzMnthBkWJgmWpQ"], {
  abilities: {
    oncePerTurnActionResourceAttackGoAgain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    defendedDefenseGreaterThanWeaponAttacksPowerDestroyCombatChainCloses: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defender",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "defense-greater-than-attack-power",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "combat-chain-close",
              actor: {
                kind: "none",
              },
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-combat-chain",
            matching: "first",
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
    },
  },
});
