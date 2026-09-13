import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/first-tenet-of-chi-moon.generated.ts";

export const firstTenetOfChiMoon = definePitchFamily(fabPitchFamilies["first-tenet-of-chi-moon"], {
  abilities: () => ({
    nextBlueAttackTurnGetsWhenAttacksDraw: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenAttacksDraw",
            text: "",
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
                type: "draw",
                count: 1,
                player: "controller",
              },
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
            color: ["blue"],
          },
        },
      },
    },
  }),
});
export const { blue: firstTenetOfChiMoonBlue } = firstTenetOfChiMoon.cards;
