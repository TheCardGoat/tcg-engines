import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/promising-terrain.generated.ts";

export const promisingTerrain = definePitchFamily(fabPitchFamilies["promising-terrain"], {
  keywords: [goAgain],
  abilities: () => ({
    create1MoreSeismicSurgeTokensInsteadCreateManyPlus1: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "create",
          filter: {
            name: "Seismic Surge",
            typeBox: {
              metatypes: ["Token"],
            },
          },
        },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "while-in-arena",
      },
    },
    beginningActionPhaseDestroyThen3MoreSeismicSurgeTokensDrawGain1Life: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
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
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "zone-count",
                zone: "permanent",
                player: "controller",
                filter: {
                  name: "Seismic Surge",
                  typeBox: {
                    metatypes: ["Token"],
                  },
                },
                comparison: {
                  op: "gte",
                  value: 3,
                },
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "draw",
                    count: 1,
                    player: "controller",
                  },
                  {
                    type: "gain-life",
                    amount: 1,
                    target: {
                      selector: "controller",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: promisingTerrainBlue } = promisingTerrain.cards;
