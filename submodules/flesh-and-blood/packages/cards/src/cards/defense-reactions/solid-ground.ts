import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/solid-ground.generated.ts";

export const solidGround = definePitchFamily(fabPitchFamilies["solid-ground"], {
  abilities: () => ({
    reduceCostForSeismicSurges: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: {
            name: "Seismic Surge",
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { blue: solidGroundBlue } = solidGround.cards;
