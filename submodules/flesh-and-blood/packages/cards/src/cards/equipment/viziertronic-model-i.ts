import { arcaneBarrier, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/viziertronic-model-i.generated.ts";

export const viziertronicModelI = defineCard(
  fabCardIdentitiesByCanonicalId["PFbLkp7H79TMzLwJfGMCp"],
  {
    keywords: [arcaneBarrier(2)],
    abilities: {
      actionDestroyVizertronicModelIWheneverBoostTurnDraw: {
        kind: "activated",
        // Printed (i18n): "Whenever you boost this turn, draw a card then put a
        // card from your hand on top of your deck." Both steps are per-boost.
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        layerKeywords: [goAgain],
        // Nested sequence under multi-fire delayed-trigger (duration this-turn).
        // Prior model ran move-card once on activate (sibling of delayed draw).
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "boost",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "every",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
                {
                  type: "move-card",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["hand"],
                    count: 1,
                  },
                  to: {
                    zone: "deck",
                    position: "top",
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
);
