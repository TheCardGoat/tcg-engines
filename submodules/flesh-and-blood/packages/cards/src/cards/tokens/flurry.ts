import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/flurry.generated.ts";

export const flurry = defineCard(fabCardIdentitiesByCanonicalId.jdkmHT8QfQmMbPLBHPrHJ, {
  abilities: {
    grantAdditionalWeaponAttack: {
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
            kind: "event-object",
            selector: "activated-card",
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
          abilityType: "attack",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              // CR 5.2.3c: the burn grants the twice-per-turn allowance by
              // itself; no on-resolution decision exists.
              type: "modify-activation-limit",
              target: {
                selector: "binding",
                binding: "it",
              },
              operation: "set-total",
              count: 2,
              duration: "this-turn",
            },
          ],
        },
      },
    },
  },
});
