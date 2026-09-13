import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/divvy-up.generated.ts";

export const divvyUp = definePitchFamily(fabPitchFamilies["divvy-up"], {
  abilities: () => ({
    removeHalfGoldCountersFromTreasureIslandRoundedUp: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-counters",
            counter: {
              kind: "named",
              name: "gold",
            },
            count: {
              type: "count",
              what: "counters-on-objects",
              counter: {
                kind: "named",
                name: "gold",
              },
              player: "controller",
              filter: {
                name: "Treasure Island",
              },
              divisor: 2,
              rounding: "up",
            },
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                name: "Treasure Island",
              },
              count: 1,
            },
          },
          {
            type: "self-replacement",
            condition: {
              type: "has-status",
              status: "hero-is-thief",
            },
            modification: {
              type: "remove-counters",
              counter: {
                kind: "named",
                name: "gold",
              },
              count: {
                type: "count",
                what: "counters-on-objects",
                counter: {
                  kind: "named",
                  name: "gold",
                },
                player: "controller",
                filter: {
                  name: "Treasure Island",
                },
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  name: "Treasure Island",
                },
                count: 1,
              },
            },
          },
        ],
      },
    },
    createGoldTokensEqualNumberGoldCountersRemovedWay: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "gold",
        controller: "controller",
        count: {
          type: "count",
          what: "counters-removed",
        },
      },
    },
  }),
});
export const { blue: divvyUpBlue } = divvyUp.cards;
