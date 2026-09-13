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
              type: "optional",
              effect: {
                type: "modify-activation-limit",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                operation: "set-total",
                count: 2,
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  },
});
