import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/golden-tipple.generated.ts";

export const goldenTipple = definePitchFamily(fabPitchFamilies["golden-tipple"], {
  keywords: [goAgain],

  abilities: () => ({
    onAttackDiscardDrawCreateTokenGold: {
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
  red: goldenTippleRed,
  yellow: goldenTippleYellow,
  blue: goldenTippleBlue,
} = goldenTipple.cards;
