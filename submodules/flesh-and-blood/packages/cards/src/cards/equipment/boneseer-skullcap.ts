import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/boneseer-skullcap.generated.ts";

export const boneseerSkullcap = defineCard(
  fabCardIdentitiesByCanonicalId["mgHQCcNt99TTCMcGGwK9h"],
  {
    keywords: [temper],
    abilities: {
      whenDefendsRevealTopPutHighPowerOnTopOtherwiseBottom: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: { kind: "player", player: "ability-controller" },
            observes: { kind: "source", selector: "defender" },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "reveal",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["deck"],
                  position: "top",
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    numeric: [
                      { property: "power", basis: "base", comparison: { op: "gte", value: 6 } },
                    ],
                  },
                },
                then: {
                  type: "move-card",
                  target: { selector: "binding", binding: "it" },
                  to: { zone: "deck", position: "top" },
                },
                else: {
                  type: "move-card",
                  target: { selector: "binding", binding: "it" },
                  to: { zone: "deck", position: "bottom" },
                },
              },
            ],
          },
        },
      },
    },
  },
);
