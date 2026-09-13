import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/manifest-muscle.generated.ts";

export const manifestMuscle = definePitchFamily(fabPitchFamilies["manifest-muscle"], {
  abilities: () => ({
    createdTurnGets1Power: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "create-card",
        player: "self",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: manifestMuscleBlue } = manifestMuscle.cards;
