import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tectonic-rift.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const tectonicRift = definePitchFamily(fabPitchFamilies["tectonic-rift"], {
  keywords: [goAgain],
  abilities: () => ({
    createXSeismicSurgeTokens: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "seismic-surge",
        controller: "controller",
        count: {
          type: "x",
        },
      },
    },
  }),
});

export const { blue: tectonicRiftBlue } = tectonicRift.cards;
