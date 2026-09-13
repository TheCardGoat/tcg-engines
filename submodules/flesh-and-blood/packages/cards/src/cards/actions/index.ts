import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/index.generated.ts";

export const index = definePitchFamily(fabPitchFamilies["index"], {
  abilities: () => ({
    sequenceLookSequenceMoveCardMoveCard: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 5,
            },
            outputBinding: "them",
          },
          {
            type: "sequence",
            steps: [
              {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "them",
                },
                to: {
                  zone: "deck",
                  position: "top",
                },
              },
              {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "them",
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
            ],
          },
        ],
      },
    },
  }),
});

export const { red: indexRed, yellow: indexYellow, blue: indexBlue } = index.cards;
