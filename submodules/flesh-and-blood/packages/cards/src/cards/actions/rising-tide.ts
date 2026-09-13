import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rising-tide.generated.ts";

export const risingTide = definePitchFamily(fabPitchFamilies["rising-tide"], {
  abilities: () => ({
    playedAnotherBlueTurnGets2Power: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-another-blue-card",
        player: "controller",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: risingTideBlue } = risingTide.cards;
