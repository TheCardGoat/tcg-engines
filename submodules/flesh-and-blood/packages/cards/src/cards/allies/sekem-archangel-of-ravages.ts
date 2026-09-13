import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/sekem-archangel-of-ravages.generated.ts";
import { ward } from "../shared/keywords.ts";

export const sekemArchangelOfRavages = defineCard(
  fabCardIdentitiesByCanonicalId.PBFbJTw6qrKRHPHPDCrMT,
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
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                name: "Sekem, Archangel of Ravages",
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
                count: 1,
              },
            },
            then: {
              type: "deal-damage",
              damageType: "arcane",
              amount: 2,
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["hero", "permanent"],
                count: 1,
              },
            },
          },
        },
      },
    },
  },
);
