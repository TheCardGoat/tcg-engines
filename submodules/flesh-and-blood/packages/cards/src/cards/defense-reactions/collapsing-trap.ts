import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/collapsing-trap.generated.ts";
import { legendary, specialization } from "../shared/keywords.ts";

export const collapsingTrap = definePitchFamily(fabPitchFamilies["collapsing-trap"], {
  keywords: [legendary, specialization("Riptide")],
  abilities: () => ({
    discardHandThenDrawFewer: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defended-attack",
            relationship: {
              kind: "any",
            },
            filter: {
              hasKeyword: "go-again",
            },
          },
          target: {
            kind: "any",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attacking-hero",
                zones: ["hand"],
                count: {
                  type: "count",
                  what: "cards-in-hand",
                  player: "attacking-hero",
                },
              },
            },
            {
              type: "draw",
              count: {
                type: "difference",
                operands: [
                  {
                    type: "count",
                    what: "discarded-this-way",
                  },
                  1,
                ],
              },
              player: "opponent",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: collapsingTrapBlue } = collapsingTrap.cards;
