import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/suraya-archangel-of-knowledge.generated.ts";
import { ward } from "../shared/keywords.ts";

export const surayaArchangelOfKnowledge = defineCard(
  fabCardIdentitiesByCanonicalId["7GqwMzK8mCrkKQ9kdpF7W"],
  {
    keywords: [ward(4)],
    abilities: {
      attack: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
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
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                name: "Suraya, Archangel of Knowledge",
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["soul"],
                filter: {
                  typeBox: {
                    supertypes: ["Light"],
                  },
                },
                count: 1,
              },
            },
            then: {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "object",
                declared: "on-stack",
                player: "any",
                zones: ["hero", "permanent"],
                count: 1,
              },
            },
          },
        },
      },
      gainLifeAfterDealingDamage: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "dealt-damage",
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
                name: "Suraya, Archangel of Knowledge",
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "gain-life",
            amount: { type: "event-amount" },
            target: {
              selector: "controller",
            },
          },
        },
      },
    },
  },
);
