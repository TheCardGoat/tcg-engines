import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ironfist-revelation.generated.ts";

export const ironfistRevelation = defineCard(
  fabCardIdentitiesByCanonicalId["mPjzJQcPgCcjqgqjCPzLH"],
  {
    keywords: [temper],
    abilities: {
      whenDefendsMayTurnFaceDownCrushArsenalFace: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "turn-face-up",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["arsenal"],
                filter: {
                  hasStatus: "face-down",
                  hasKeyword: "crush",
                },
                count: 1,
              },
              outputBinding: "it",
            },
            then: {
              type: "add-counter",
              counter: {
                kind: "numeric",
                value: 1,
                property: "power",
              },
              count: 1,
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          },
        },
      },
    },
  },
);
