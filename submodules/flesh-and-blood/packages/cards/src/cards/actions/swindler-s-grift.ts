import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/swindler-s-grift.generated.ts";

export const swindlerSGrift = definePitchFamily(fabPitchFamilies["swindler-s-grift"], {
  abilities: () => ({
    createGoldWhenAttacking: {
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
                color: ["yellow"],
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
                type: "create-token",
                token: "gold",
                controller: "controller",
              },
            ],
          },
        },
      },
    },
  }),
});
export const {
  red: swindlerSGriftRed,
  yellow: swindlerSGriftYellow,
  blue: swindlerSGriftBlue,
} = swindlerSGrift.cards;
