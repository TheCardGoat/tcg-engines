import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/azvolai.generated.ts";

export const azvolai = defineCard(fabCardIdentitiesByCanonicalId.wBNMRCQPNBjPcfJwgrf9j, {
  abilities: {
    dealArcaneDamageOnAttack: {
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
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["hero", "permanent"],
              count: {
                type: "up-to",
                amount: 2,
              },
            },
            source: {
              selector: "self",
            },
          },
        },
      },
    },
  },
});
