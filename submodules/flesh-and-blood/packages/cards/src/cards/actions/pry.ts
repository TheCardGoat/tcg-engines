import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pry.generated.ts";

export const pry = definePitchFamily(fabPitchFamilies["pry"], {
  parameters: {
    red: { revealCount: 3 },
    yellow: { revealCount: 2 },
    blue: { revealCount: 1 },
  },
  abilities: ({ revealCount }) => ({
    sequenceRevealConditionalTurnPlayerAllOptionalSequenceChooseCardMoveCardDraw: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              playerTarget: { selector: "any-hero" },
              playerTargetBinding: "looked-hero",
              zones: ["hand"],
              count: {
                type: "conditional",
                condition: { type: "turn-player", who: "opponent" },
                then: { type: "all" },
                else: revealCount,
              },
            },
          },
          {
            type: "optional",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "choose-card",
                  chooser: "controller",
                  target: {
                    selector: "binding",
                    binding: "revealed-this-way",
                    count: 1,
                  },
                  outputBinding: "it",
                },
                {
                  type: "move-card",
                  target: { selector: "binding", binding: "it" },
                  to: { zone: "deck", position: "bottom" },
                },
                { type: "draw", count: 1, player: "target-controller" },
              ],
            },
          },
        ],
      },
    },
  }),
});

export const { red: pryRed, yellow: pryYellow, blue: pryBlue } = pry.cards;
