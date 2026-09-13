import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/leap-frog-leggings.generated.ts";

export const leapFrogLeggings = defineCard(
  fabCardIdentitiesByCanonicalId["8mrLmWTr8TBJgjCpzBzmB"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenOpponentPlaysActivatesAttackReactionMayAddActive: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "play",
            actor: {
              kind: "player",
              player: "opponent",
            },
            observes: {
              kind: "event-object",
              selector: "played-card",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  types: ["Attack Reaction"],
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
              type: "add-defending",
              target: {
                selector: "self",
              },
            },
          },
        },
      },
      whenOpponentPlaysActivatesAttackReactionMayAddActive2: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "activate",
            actor: {
              kind: "player",
              player: "opponent",
            },
            observes: {
              kind: "event-object",
              selector: "activated-card",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  types: ["Attack Reaction"],
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
              type: "add-defending",
              target: {
                selector: "self",
              },
            },
          },
        },
      },
    },
  },
);
