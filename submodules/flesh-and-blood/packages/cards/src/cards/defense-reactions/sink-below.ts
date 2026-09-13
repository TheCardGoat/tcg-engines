import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/sink-below.generated.ts";

export const sinkBelow = definePitchFamily(fabPitchFamilies["sink-below"], {
  abilities: () => ({
    bottomAndDraw: {
      type: "optional",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["hand"],
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
  }),
});

export const { red: sinkBelowRed, yellow: sinkBelowYellow, blue: sinkBelowBlue } = sinkBelow.cards;
