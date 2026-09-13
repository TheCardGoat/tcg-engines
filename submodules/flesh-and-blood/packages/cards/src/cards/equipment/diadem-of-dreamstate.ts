import { ward } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/diadem-of-dreamstate.generated.ts";

export const diademOfDreamstate = defineCard(
  fabCardIdentitiesByCanonicalId["LFhRKcJC6fbfQjKdqLqp7"],
  {
    keywords: [ward(2)],
    abilities: {
      oncePerTurnWhenNonTokenPermanentControlWard: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "destroy",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "moved-object",
              relationship: {
                kind: "controller",
                player: "ability-controller",
              },
              filter: {
                hasKeyword: "ward",
                typeBox: {
                  excludeMetatypes: ["Token"],
                },
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "pay",
              cost: {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              payer: "controller",
            },
            then: {
              type: "create-token",
              token: "ponder",
              controller: "controller",
            },
          },
        },
        limit: {
          count: 1,
          per: "turn",
        },
      },
    },
  },
);
