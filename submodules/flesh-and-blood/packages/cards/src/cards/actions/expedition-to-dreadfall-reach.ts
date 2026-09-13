import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/expedition-to-dreadfall-reach.generated.ts";

export const expeditionToDreadfallReach = definePitchFamily(
  fabPitchFamilies["expedition-to-dreadfall-reach"],
  {
    abilities: () => ({
      whenAttacksMayPutGoldCounterTreasureIsland: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "attack",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "attack",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "gold",
              },
              count: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                zones: ["permanent"],
                filter: {
                  name: "Treasure Island",
                },
                count: 1,
              },
            },
          },
        },
      },
    }),
  },
);
export const { red: expeditionToDreadfallReachRed } = expeditionToDreadfallReach.cards;
