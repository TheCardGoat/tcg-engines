import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/emissary-of-moon.generated.ts";

export const emissaryOfMoon = definePitchFamily(fabPitchFamilies["emissary-of-moon"], {
  abilities: () => ({
    whenAttacksMayPutFromHandBottomDeckIf: {
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
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {},
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
          then: {
            type: "draw",
            count: 1,
            player: "controller",
          },
        },
      },
    },
  }),
});
export const { red: emissaryOfMoonRed } = emissaryOfMoon.cards;
