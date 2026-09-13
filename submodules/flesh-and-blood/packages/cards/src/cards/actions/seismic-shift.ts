import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/seismic-shift.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const seismicShift = definePitchFamily(fabPitchFamilies["seismic-shift"], {
  keywords: [goAgain],
  abilities: () => ({
    asAdditionalCostPlayTXSeismicSurgeTokensControl: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "tap",
          count: {
            type: "x",
          },
          filter: {
            name: "Seismic Surge",
          },
        },
      },
    },
    destroyXAuraTokens: {
      kind: "resolution",
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["permanent"],
          filter: {
            typeBox: {
              metatypes: ["Token"],
              subtypes: ["Aura"],
            },
          },
          count: {
            type: "x",
          },
        },
      },
    },
  }),
});

export const { red: seismicShiftRed } = seismicShift.cards;
