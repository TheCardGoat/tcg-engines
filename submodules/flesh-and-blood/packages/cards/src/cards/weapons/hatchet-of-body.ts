import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/hatchet-of-body.generated.ts";

export const hatchetOfBody = defineCard(fabCardIdentitiesByCanonicalId["99B9LdcMnLqBhwjQmrHRG"], {
  abilities: {
    oncePerTurnActionResourceAttack: {
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
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    wheneverAttackHatchetBodyHatchetMindLastAttackTurnHatchetBodyGains1PowerEndTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
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
              // Must match catalogNameFromSlug("hatchet-of-body") → "Hatchet Of Body"
              name: "Hatchet Of Body",
            },
          },
        },
        state: {
          type: "last-attack-this-turn",
          names: ["Hatchet of Mind"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  },
});
