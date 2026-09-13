import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/seismic-stir.generated.ts";

export const seismicStir = definePitchFamily(fabPitchFamilies["seismic-stir"], {
  parameters: pitchMap({ red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } }),
  keywords: [goAgain],
  abilities: ({ value1: _value1 }) => ({
    resolutionCreateToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "seismic-surge",
        controller: "controller",
        count: 3,
      },
    },
  }),
});

export const {
  red: seismicStirRed,
  yellow: seismicStirYellow,
  blue: seismicStirBlue,
} = seismicStir.cards;
