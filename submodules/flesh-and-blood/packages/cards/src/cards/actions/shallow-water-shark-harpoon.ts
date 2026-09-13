import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shallow-water-shark-harpoon.generated.ts";

export const shallowWaterSharkHarpoon = definePitchFamily(
  fabPitchFamilies["shallow-water-shark-harpoon"],
  {
    abilities: () => ({
      veActivatedCannonTurnGetsWhenHitsHeroDestroyInTheirArsenal: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "performed-this-turn",
          event: "activate-cannon",
          player: "controller",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "whenHitsHeroDestroyInTheirArsenalDoCreateGoldToken",
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
                  type: "if-you-do",
                  effect: {
                    type: "destroy",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["arsenal"],
                      filter: {},
                      count: 1,
                    },
                  },
                  then: {
                    type: "create-token",
                    token: "gold",
                    controller: "controller",
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
      },
    }),
  },
);

export const { yellow: shallowWaterSharkHarpoonYellow } = shallowWaterSharkHarpoon.cards;
