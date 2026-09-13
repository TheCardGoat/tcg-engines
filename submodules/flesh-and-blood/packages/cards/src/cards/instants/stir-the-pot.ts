import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/stir-the-pot.generated.ts";

export const stirThePot = definePitchFamily(fabPitchFamilies["stir-the-pot"], {
  keywords: [legendary],
  abilities: () => ({
    shuffle: {
      kind: "resolution",
      effect: {
        type: "shuffle",
        zone: "deck",
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

export const { blue: stirThePotBlue } = stirThePot.cards;
