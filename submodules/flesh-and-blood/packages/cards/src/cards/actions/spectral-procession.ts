import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spectral-procession.generated.ts";
import { phantasm } from "../shared/keywords.ts";

export const spectralProcession = definePitchFamily(fabPitchFamilies["spectral-procession"], {
  keywords: [phantasm],
  abilities: () => ({
    spectralProcessionSPowerEqualNumberSpectralShieldsControl: {
      kind: "static",
      staticKind: "property",
      property: "power",
      value: {
        type: "count",
        what: "cards-in-zone",
        zone: "permanent",
        player: "controller",
        filter: {
          name: "Spectral Shield",
        },
      },
    },
  }),
});

export const { red: spectralProcessionRed } = spectralProcession.cards;
