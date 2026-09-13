import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wrecking-ball.generated.ts";

export const wreckingBall = definePitchFamily(fabPitchFamilies["wrecking-ball"], {
  abilities: () => ({
    whenAttackWithWreckingBallDrawDiscardRandomWithNumber6MorePower: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Wrecking Ball",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
            {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
                random: true,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: {
                  type: "count",
                  what: "discarded-this-way",
                  filter: { power: { op: "gte", value: 6 } },
                },
                comparison: { op: "gte", value: 1 },
              },
              then: {
                type: "intimidate",
                target: "opponent",
              },
            },
          ],
        },
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const { red: wreckingBallRed } = wreckingBall.cards;
