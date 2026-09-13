import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/colossal-bearing.generated.ts";

export const colossalBearing = definePitchFamily(fabPitchFamilies["colossal-bearing"], {
  abilities: () => ({
    ifHas13MoreGetsWhenHitsHeroDestroy: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "attack-power",
        comparison: { op: "gte", value: 13 },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroDestroyEquipmentTheyControl1Less",
            text: "",
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
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "attack-target",
                  zones: ["permanent"],
                  filter: {
                    typeBox: {
                      types: ["Equipment"],
                    },
                    defense: {
                      op: "lte",
                      value: 1,
                    },
                  },
                  count: 1,
                },
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
      label: {
        name: "tower",
      },
    },
  }),
});
export const { red: colossalBearingRed } = colossalBearing.cards;
