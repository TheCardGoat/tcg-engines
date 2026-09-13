import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/board-the-ship.generated.ts";

import { overpower } from "../shared/keywords.ts";

export const boardTheShip = definePitchFamily(fabPitchFamilies["board-the-ship"], {
  keywords: [overpower],
  abilities: () => ({
    whenAttacksMayAllyControlIfDoGetsOverpower: {
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
            type: "tap",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
              count: 1,
            },
          },
          then: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: overpower,
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
export const { red: boardTheShipRed } = boardTheShip.cards;
