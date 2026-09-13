import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/seismic-eruption.generated.ts";

export const seismicEruption = definePitchFamily(fabPitchFamilies["seismic-eruption"], {
  abilities: () => ({
    create3SeismicSurgeTokens: {
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

export const { yellow: seismicEruptionYellow } = seismicEruption.cards;
