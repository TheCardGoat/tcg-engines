import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tidal-surge.generated.ts";

export const tidalSurge = definePitchFamily(fabPitchFamilies["tidal-surge"], {
  abilities: () => ({
    vePlayedAnotherBlueTurnGetsNumber2Power: {
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

export const { blue: tidalSurgeBlue } = tidalSurge.cards;
