import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/parched-terrain.generated.ts";

export const parchedTerrain = definePitchFamily(fabPitchFamilies["parched-terrain"], {
  abilities: () => ({
    heroesCanTGain: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "gain-life",
        duration: "while-in-arena",
      },
    },
    atBeginningEndPhasePutSandCounterThenDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "sand",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
            {
              type: "unless",
              effect: {
                type: "destroy",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
              escape: {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["graveyard"],
                  filter: {
                    color: ["red"],
                  },
                  count: {
                    type: "count",
                    what: "counters-on-source",
                    counter: {
                      kind: "named",
                      name: "sand",
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: parchedTerrainRed } = parchedTerrain.cards;
