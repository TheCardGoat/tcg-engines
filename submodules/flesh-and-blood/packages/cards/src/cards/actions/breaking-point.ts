import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/breaking-point.generated.ts";

export const breakingPoint = definePitchFamily(fabPitchFamilies["breaking-point"], {
  abilities: () => ({
    ifBreakingPointIsPlayedAsChainLink4: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "chain-link-count",
        comparison: {
          op: "gte",
          value: 4,
        },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroDestroyAllTheirArsenal",
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
                  player: "opponent",
                  zones: ["arsenal"],
                  count: {
                    type: "all",
                  },
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
        name: "rupture",
      },
    },
  }),
});
export const { red: breakingPointRed } = breakingPoint.cards;
