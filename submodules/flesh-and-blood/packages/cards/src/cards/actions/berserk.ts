import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/berserk.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const berserk = definePitchFamily(fabPitchFamilies["berserk"], {
  keywords: [goAgain],
  abilities: () => ({
    untilEndTurnWheneverDiscardRandom6MoreBanish: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "discard",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "discarded-card",
              relationship: {
                kind: "any",
              },
              filter: {
                numeric: [
                  {
                    property: "power",
                    basis: "current",
                    comparison: { op: "gte", value: 6 },
                  },
                ],
              },
              bindAs: "it",
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
            type: "if-you-do",
            effect: {
              type: "banish",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
            then: {
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
                  outputBinding: "revealed",
                },
                {
                  type: "conditional",
                  condition: {
                    type: "binding-matches",
                    binding: "revealed",
                    filter: {
                      numeric: [
                        {
                          property: "power",
                          basis: "current",
                          comparison: { op: "gte", value: 6 },
                        },
                      ],
                    },
                  },
                  then: {
                    type: "draw",
                    count: 1,
                    player: "controller",
                  },
                },
              ],
            },
          },
        },
      },
    },
  }),
});
export const { yellow: berserkYellow } = berserk.cards;
