import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/conquer-the-icy-terrain.generated.ts";

export const conquerTheIcyTerrain = definePitchFamily(fabPitchFamilies["conquer-the-icy-terrain"], {
  abilities: () => ({
    staticTriggeredHitHitUnlessDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "unless",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attack-target",
              zones: ["arsenal", "permanent"],
              filter: {
                hasStatus: "frozen",
                typeBox: {
                  excludeTypes: ["Hero"],
                },
              },
              count: 1,
            },
          },
          escape: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 2,
            },
            payer: "opponent",
          },
        },
      },
    },
  }),
});

export const {
  red: conquerTheIcyTerrainRed,
  yellow: conquerTheIcyTerrainYellow,
  blue: conquerTheIcyTerrainBlue,
} = conquerTheIcyTerrain.cards;
