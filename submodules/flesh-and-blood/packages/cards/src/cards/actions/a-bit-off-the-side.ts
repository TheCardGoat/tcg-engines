import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/a-bit-off-the-side.generated.ts";

export const aBitOffTheSide = definePitchFamily(fabPitchFamilies["a-bit-off-the-side"], {
  abilities: () => ({
    untilEndTurnAxesControlGetWhenHitsHero: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroTheyDiscard",
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
                type: "discard",
                target: {
                  selector: "attack-target",
                },
              },
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Axe"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: aBitOffTheSideRed } = aBitOffTheSide.cards;
