import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/siren-s-call.generated.ts";

export const sirenSCall = definePitchFamily(fabPitchFamilies["siren-s-call"], {
  abilities: () => ({
    forceBlueCardToDefendAndDraw: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "defending-hero",
              zones: ["hand"],
              count: {
                type: "all",
              },
            },
          },
          {
            type: "choose-card",
            target: {
              selector: "binding",
              binding: "revealed-this-way",
              filter: {
                color: ["blue"],
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "if-you-do",
            effect: {
              type: "add-defending",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
            then: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
        ],
      },
    },
  }),
});

export const { red: sirenSCallRed } = sirenSCall.cards;
