import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/actions/deathmatch-arena.generated.ts";
import { goAgain, legendary } from "../shared/keywords.ts";

export const deathmatchArena = defineCard(fabCardIdentitiesByCanonicalId["F78CPMJgBqhTfNMLM7TH6"], {
  keywords: [legendary, goAgain],
  abilities: {
    heroesCanAttackAnyOpposingHero: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "allow",
        action: "attack-target",
        filter: {
          typeBox: {
            types: ["Hero"],
          },
        },
        duration: "while-in-arena",
      },
    },
    whenHeroDealsLethalDamageAnotherHeroTheyCreate: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "deal-damage",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "damage-source",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "lethal",
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "gold",
          controller: "controller",
          count: {
            type: "count",
            what: "heroes-started-game",
          },
        },
      },
    },
  },
});
