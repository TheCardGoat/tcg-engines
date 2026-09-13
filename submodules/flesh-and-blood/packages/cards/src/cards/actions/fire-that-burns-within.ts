import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fire-that-burns-within.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const fireThatBurnsWithin = definePitchFamily(fabPitchFamilies["fire-that-burns-within"], {
  keywords: [goAgain],
  abilities: () => ({
    whenAttacksMayDiscardPhoenixFlameIfDoDraw: {
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
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                name: "Phoenix Flame",
              },
              count: 1,
            },
            outputBinding: "it",
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
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 2,
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
            ],
          },
        },
      },
    },
  }),
});
export const { red: fireThatBurnsWithinRed } = fireThatBurnsWithin.cards;
