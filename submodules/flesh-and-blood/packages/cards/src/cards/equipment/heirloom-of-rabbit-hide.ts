import { cloaked, ward } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heirloom-of-rabbit-hide.generated.ts";

export const heirloomOfRabbitHide = defineCard(
  fabCardIdentitiesByCanonicalId["z7HGHDCwMDgBmhdhTnRhW"],
  {
    keywords: [cloaked, ward(4)],
    abilities: {
      atStartTurnIfHaveExactly1MayTurn: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "start-phase",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
          state: {
            type: "and",
            conditions: [
              {
                type: "has-status",
                status: "equipped-face-down",
              },
              {
                type: "life-comparison",
                player: "self",
                vs: "fixed",
                op: "eq",
                value: 1,
              },
            ],
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "turn-face-up",
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
