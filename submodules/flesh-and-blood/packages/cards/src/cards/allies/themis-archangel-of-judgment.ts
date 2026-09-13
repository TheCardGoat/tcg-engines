import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/themis-archangel-of-judgment.generated.ts";
import { ward } from "../shared/keywords.ts";

export const themisArchangelOfJudgment = defineCard(
  fabCardIdentitiesByCanonicalId["8cQmdjw8zKNzddKkwcHWj"],
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
      turnBanishedCardFaceDownOnAttack: {
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
                name: "Themis, Archangel of Judgment",
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
              type: "turn-face-down",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "any",
                zones: ["banished"],
                count: 1,
              },
            },
          },
        },
      },
    },
  },
);
