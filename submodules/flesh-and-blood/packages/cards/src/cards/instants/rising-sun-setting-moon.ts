import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/rising-sun-setting-moon.generated.ts";

export const risingSunSettingMoon = definePitchFamily(fabPitchFamilies["rising-sun-setting-moon"], {
  keywords: [legendary],
  abilities: () => ({
    drawThenPutFromHandBottomDeck: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 1,
            player: "controller",
          },
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {},
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
        ],
      },
      label: {
        name: "transcend",
      },
    },
    ifVePlayedAnotherBlueTurnTranscend: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-another-blue-card",
        player: "controller",
      },
      effect: {
        type: "transcend",
        target: {
          selector: "self",
        },
      },
      label: {
        name: "transcend",
      },
    },
  }),
});

export const { blue: risingSunSettingMoonBlue } = risingSunSettingMoon.cards;
