import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/break-ground.generated.ts";

export const breakGround = definePitchFamily(fabPitchFamilies["break-ground"], {
  abilities: () => ({
    staticTriggeredAttackAttackOptionalMoveDraw: {
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
              name: "Break Ground",
            },
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
              zones: ["arsenal"],
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

export const {
  red: breakGroundRed,
  yellow: breakGroundYellow,
  blue: breakGroundBlue,
} = breakGround.cards;
