import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/homage-to-ancestors.generated.ts";

export const homageToAncestors = definePitchFamily(fabPitchFamilies["homage-to-ancestors"], {
  keywords: [legendary],
  abilities: () => ({
    gain1: {
      kind: "resolution",
      effect: {
        type: "gain-life",
        amount: 1,
        target: {
          selector: "controller",
        },
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

export const { blue: homageToAncestorsBlue } = homageToAncestors.cards;
