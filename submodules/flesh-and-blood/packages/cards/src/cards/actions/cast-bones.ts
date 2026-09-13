import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cast-bones.generated.ts";

export const castBones = definePitchFamily(fabPitchFamilies["cast-bones"], {
  abilities: () => ({
    revealTop6DeckCreateMightTokenEach6: {
      kind: "resolution",
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
              count: 6,
            },
          },
          {
            type: "create-token",
            token: "might",
            controller: "controller",
            count: {
              type: "count",
              what: "revealed-this-way",
              filter: {
                power: {
                  op: "gte",
                  value: 6,
                },
              },
            },
          },
          {
            type: "sequence",
            steps: [
              {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["deck"],
                  filter: {
                    hasStatus: "revealed",
                  },
                  count: {
                    type: "all",
                  },
                },
                to: {
                  zone: "deck",
                  position: "top",
                },
              },
              {
                type: "shuffle",
                zone: "deck",
              },
            ],
          },
        ],
      },
    },
    ifControl6MoreMightTokensCreateAgilityToken: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "permanent",
        player: "controller",
        filter: {
          name: "Might",
          typeBox: {
            metatypes: ["Token"],
          },
        },
        comparison: {
          op: "gte",
          value: 6,
        },
      },
      effect: {
        type: "create-token",
        token: "agility",
        controller: "controller",
      },
    },
  }),
});
export const { red: castBonesRed } = castBones.cards;
