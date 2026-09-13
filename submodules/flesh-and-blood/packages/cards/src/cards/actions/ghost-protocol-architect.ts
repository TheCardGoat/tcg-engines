import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/ghost-protocol-architect.generated.ts";

export const ghostProtocolArchitect = definePitchFamily(
  fabPitchFamilies["ghost-protocol-architect"],
  {
    abilities: () => ({
      ifWasBanishedFromBoostingTurnMayPlayFrom: {
        kind: "static",
        staticKind: "play",
        condition: {
          type: "performed-this-turn",
          event: "banish-from-boost",
          player: "controller",
        },
        playEffect: {
          role: "permission",
          fromZones: ["banished"],
          optional: true,
        },
      },
      whenAttacksSearchDeckEvoCostLessThanEqual: {
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
            type: "sequence",
            steps: [
              {
                type: "search",
                zones: ["deck"],
                filter: {
                  typeBox: {
                    subtypes: ["Evo"],
                  },
                  cost: {
                    op: "lte",
                    value: {
                      type: "count",
                      what: "equipped-objects",
                      player: "controller",
                      filter: {
                        typeBox: {
                          subtypes: ["Evo"],
                        },
                      },
                    },
                  },
                },
                mayFail: true,
                to: {
                  zone: "banished",
                },
              },
              {
                type: "shuffle",
                zone: "deck",
              },
            ],
          },
        },
        label: {
          name: "evo-upgrade",
        },
      },
    }),
  },
);
export const { red: ghostProtocolArchitectRed } = ghostProtocolArchitect.cards;
