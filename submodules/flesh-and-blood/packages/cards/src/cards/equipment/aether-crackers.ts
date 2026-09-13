import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/aether-crackers.generated.ts";

export const aetherCrackers = defineCard(fabCardIdentitiesByCanonicalId["BhFQMNHMHH9ddMH86tqQ9"], {
  abilities: {
    whenAttackControlHitsHeroMayDestroyIfDo: {
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
                subtypes: ["Attack"],
              },
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "self",
            },
          },
          then: {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "attack-target",
            },
          },
        },
      },
    },
  },
});
