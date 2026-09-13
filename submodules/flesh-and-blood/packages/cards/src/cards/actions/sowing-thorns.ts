import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sowing-thorns.generated.ts";

export const sowingThorns = definePitchFamily(fabPitchFamilies["sowing-thorns"], {
  abilities: () => ({
    gainNumber1Life: {
      kind: "resolution",
      effect: {
        type: "gain-life",
        amount: 1,
        target: {
          selector: "controller",
        },
      },
    },
    banishNumber2EarthActionFromGraveyardDoSearchDeckForEarthAura: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["graveyard"],
                    filter: {
                      typeBox: {
                        supertypes: ["Earth"],
                      },
                    },
                    count: 2,
                  },
                },
                {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["graveyard"],
                    filter: {
                      typeBox: {
                        types: ["Action"],
                      },
                    },
                    count: 1,
                  },
                },
              ],
            },
            then: {
              type: "optional",
              effect: {
                type: "search",
                zones: ["deck"],
                filter: {
                  and: [
                    {
                      typeBox: {
                        supertypes: ["Earth"],
                      },
                    },
                    {
                      typeBox: {
                        subtypes: ["Aura"],
                      },
                    },
                  ],
                  cost: {
                    op: "lt",
                    value: {
                      type: "count",
                      what: "life-gained-this-turn",
                      player: "controller",
                    },
                  },
                },
                mayFail: true,
                to: {
                  zone: "deck",
                  position: "top",
                },
              },
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
      label: {
        name: "decompose",
      },
    },
  }),
});

export const { red: sowingThornsRed } = sowingThorns.cards;
