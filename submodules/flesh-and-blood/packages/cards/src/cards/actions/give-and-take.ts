import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/give-and-take.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const giveAndTake = definePitchFamily(fabPitchFamilies["give-and-take"], {
  keywords: [goAgain],
  abilities: () => ({
    wheneverActionDefendsMayPutActionCostLessThan: {
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
            selector: "defender",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                types: ["Action"],
              },
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
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  types: ["Action"],
                },
                numeric: [
                  {
                    property: "cost",
                    basis: "base",
                    comparison: {
                      op: "lt",
                      value: {
                        type: "subject-property",
                        property: "power",
                        basis: "current",
                      },
                    },
                  },
                ],
              },
              count: 1,
            },
            to: {
              zone: "deck",
              position: "top",
            },
          },
        },
      },
    },
  }),
});
export const { red: giveAndTakeRed } = giveAndTake.cards;
