import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/knick-knack-bric-a-brac.generated.ts";

export const knickKnackBricABrac = definePitchFamily(fabPitchFamilies["knick-knack-bric-a-brac"], {
  abilities: () => ({
    additionalCostPlayKnickKnackBricBracDestroyAnyNumberCopperSilverGold: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "destroy",
          filter: {
            or: [{ name: "Copper" }, { name: "Silver" }, { name: "Gold" }],
          },
          count: {
            type: "any-number",
          },
        },
        optional: true,
      },
    },
    searchDeckAmuletPotionTalismanNamePutArenaThenShuffle4Copper2Silver1GoldDestroyedWayRepeatProcess:
      {
        kind: "resolution",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "sequence",
              steps: [
                {
                  type: "search",
                  zones: ["deck"],
                  filter: {
                    or: [
                      {
                        moniker: "Amulet",
                      },
                      {
                        moniker: "Potion",
                      },
                      {
                        moniker: "Talisman",
                      },
                    ],
                  },
                  to: {
                    zone: "permanent",
                  },
                  mayFail: true,
                },
                {
                  type: "shuffle",
                  zone: "deck",
                },
              ],
            },
            {
              type: "repeat",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "search",
                    zones: ["deck"],
                    filter: {
                      or: [
                        {
                          moniker: "Amulet",
                        },
                        {
                          moniker: "Potion",
                        },
                        {
                          moniker: "Talisman",
                        },
                      ],
                    },
                    to: {
                      zone: "permanent",
                    },
                    mayFail: true,
                  },
                  {
                    type: "shuffle",
                    zone: "deck",
                  },
                ],
              },
              times: {
                type: "sum",
                operands: [
                  {
                    type: "count",
                    what: "destroyed-this-way",
                    filter: { name: "Copper" },
                    divisor: 4,
                  },
                  {
                    type: "count",
                    what: "destroyed-this-way",
                    filter: { name: "Silver" },
                    divisor: 2,
                  },
                  {
                    type: "count",
                    what: "destroyed-this-way",
                    filter: { name: "Gold" },
                  },
                ],
              },
            },
          ],
        },
      },
  }),
});

export const { red: knickKnackBricABracRed } = knickKnackBricABrac.cards;
