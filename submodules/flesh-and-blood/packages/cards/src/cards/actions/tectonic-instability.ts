import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tectonic-instability.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const tectonicInstability = definePitchFamily(fabPitchFamilies["tectonic-instability"], {
  keywords: [goAgain],
  abilities: () => ({
    eachHeroPutsFromTheirArsenalOnBottomTheirDeckTheyDo: {
      kind: "resolution",
      effect: {
        type: "for-each",
        target: {
          selector: "each-hero",
        },
        effect: {
          type: "if-you-do",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              zones: ["arsenal"],
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
            player: "iteration-subject",
          },
        },
      },
    },
    createSeismicSurgeTokensEqualNumberDrawnWay: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "seismic-surge",
        controller: "controller",
        count: {
          type: "count",
          what: "drawn-this-way",
        },
      },
    },
  }),
});

export const { blue: tectonicInstabilityBlue } = tectonicInstability.cards;
