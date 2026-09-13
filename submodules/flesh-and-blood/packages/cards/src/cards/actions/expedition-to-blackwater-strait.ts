import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/expedition-to-blackwater-strait.generated.ts";

export const expeditionToBlackwaterStrait = definePitchFamily(
  fabPitchFamilies["expedition-to-blackwater-strait"],
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
export const { red: expeditionToBlackwaterStraitRed } = expeditionToBlackwaterStrait.cards;
