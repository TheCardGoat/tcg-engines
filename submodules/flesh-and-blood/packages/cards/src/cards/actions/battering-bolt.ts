import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/battering-bolt.generated.ts";

export const batteringBolt = definePitchFamily(fabPitchFamilies["battering-bolt"], {
  abilities: () => ({
    ifBatteringBoltHitsHeroTheyRevealTheirHand: {
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
          type: "sequence",
          steps: [
            {
              type: "sequence",
              steps: [
                {
                  type: "reveal",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "attack-target",
                    zones: ["hand"],
                    count: {
                      type: "all",
                    },
                  },
                },
                {
                  type: "discard",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "attack-target",
                    zones: ["hand"],
                    filter: {
                      typeBox: {
                        excludeTypes: ["Action"],
                      },
                    },
                    count: {
                      type: "all",
                    },
                  },
                  outputBinding: "it",
                },
              ],
            },
            {
              type: "lose-life",
              amount: {
                type: "count",
                what: "discarded-this-way",
              },
              target: {
                selector: "attack-target",
              },
            },
          ],
        },
      },
    },
  }),
});
export const { red: batteringBoltRed } = batteringBolt.cards;
