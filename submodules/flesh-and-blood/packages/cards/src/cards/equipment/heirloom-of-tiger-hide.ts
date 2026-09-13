import { bladeBreak, cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heirloom-of-tiger-hide.generated.ts";

export const heirloomOfTigerHide = defineCard(
  fabCardIdentitiesByCanonicalId["6F7r7J6hRpwwH8hrtjdTp"],
  {
    keywords: [cloaked, bladeBreak],
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
