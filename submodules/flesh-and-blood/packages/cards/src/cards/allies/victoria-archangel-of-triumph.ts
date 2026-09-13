import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/victoria-archangel-of-triumph.generated.ts";
import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { ward } from "../shared/keywords.ts";

export const victoriaArchangelOfTriumph = defineCard(
  fabCardIdentitiesByCanonicalId.RCqkLt7cqwdWMNrmFqpc8,
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
      weakenOpponentAttacksOnAttack: {
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
                name: "Victoria, Archangel of Triumph",
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
              type: "modify-numeric",
              property: "power",
              op: "subtract",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["combat-chain"],
                filter: attackActionFilter(),
                count: {
                  type: "all",
                },
              },
              duration: "until-end-of-next-turn",
            },
          },
        },
      },
    },
  },
);
