import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sky-fire-lanterns.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const skyFireLanterns = definePitchFamily(fabPitchFamilies["sky-fire-lanterns"], {
  parameters: pitchMap({ red: "red", yellow: "yellow", blue: "blue" }),
  keywords: [goAgain],
  abilities: (color) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                color: [color],
              },
            },
            then: {
              type: "create-token",
              token: "runechant",
              controller: "controller",
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: skyFireLanternsRed,
  yellow: skyFireLanternsYellow,
  blue: skyFireLanternsBlue,
} = skyFireLanterns.cards;
