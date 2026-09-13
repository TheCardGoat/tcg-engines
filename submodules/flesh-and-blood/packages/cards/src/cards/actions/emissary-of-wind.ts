import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/emissary-of-wind.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const emissaryOfWind = definePitchFamily(fabPitchFamilies["emissary-of-wind"], {
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
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
      },
    },
  }),
});
export const { red: emissaryOfWindRed } = emissaryOfWind.cards;
