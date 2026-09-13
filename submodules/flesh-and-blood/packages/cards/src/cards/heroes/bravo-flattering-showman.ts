import { dominate, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/bravo-flattering-showman.generated.ts";

export const bravoFlatteringShowman = defineCard(
  fabCardIdentitiesByCanonicalId["DbqGjQMfWLNCfd7qGqGht"],
  {
    keywords: [goAgain],
    abilities: {
      actionResourceResourceTapTurnFaceDownArsenalFaceUpCrushGets2PowerDominateTurnGoAgain: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 2,
            },
            {
              class: "effect",
              type: "tap-self",
            },
          ],
        },
        layerKeywords: [goAgain],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "turn-face-up",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["arsenal"],
                filter: {
                  hasStatus: "face-down",
                },
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
                  hasKeyword: "crush",
                },
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "modify-numeric",
                    property: "power",
                    op: "add",
                    amount: 2,
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    // Printed "this turn" — not a permanent base rewrite.
                    duration: "this-turn",
                  },
                  {
                    type: "grant-property",
                    property: {
                      kind: "keyword",
                      keyword: dominate,
                    },
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    duration: "this-turn",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
);
