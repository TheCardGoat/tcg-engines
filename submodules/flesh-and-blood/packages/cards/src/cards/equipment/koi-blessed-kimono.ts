import { cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/koi-blessed-kimono.generated.ts";

export const koiBlessedKimono = defineCard(
  fabCardIdentitiesByCanonicalId["mccHtdK6wgfhL6g98CKMT"],
  {
    keywords: [cloaked],
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
      whenIsTurnedFaceUpDestroySearchDeckInner: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "turn-face-up",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "source",
              selector: "object",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
              {
                type: "search",
                zones: ["deck"],
                filter: {
                  name: "Inner Chi",
                },
                mayFail: true,
                to: {
                  zone: "hand",
                },
              },
              {
                type: "shuffle",
                zone: "deck",
              },
            ],
          },
        },
      },
    },
  },
);
