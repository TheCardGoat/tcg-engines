import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/dorinthea.generated.ts";

export const dorinthea = defineCard(fabCardIdentitiesByCanonicalId["KGqRPDfRrnPqdj7Cm76fr"], {
  abilities: {
    oncePerTurnEffectWeaponHitsAttackAdditionalTimeWeaponTurn: {
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
            filter: {
              typeBox: {
                types: ["Weapon"],
              },
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        // CR 5.2.3c: "you may attack an additional time" is activation-limit
        // permission, not an optional trigger the controller accepts or declines.
        effect: {
          type: "modify-activation-limit",
          target: {
            selector: "binding",
            binding: "it",
          },
          operation: "additional",
          count: 1,
          duration: "this-turn",
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
