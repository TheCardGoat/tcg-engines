import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/water-glow-lanterns.generated.ts";

export const waterGlowLanterns = definePitchFamily(fabPitchFamilies["water-glow-lanterns"], {
  parameters: pitchMap({
    red: { color: "red" },
    yellow: { color: "yellow" },
    blue: { color: "blue" },
  }),
  keywords: [goAgain],
  abilities: ({ color }) => ({
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
              token: "spectral-shield",
              controller: "controller",
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: waterGlowLanternsRed,
  yellow: waterGlowLanternsYellow,
  blue: waterGlowLanternsBlue,
} = waterGlowLanterns.cards;
