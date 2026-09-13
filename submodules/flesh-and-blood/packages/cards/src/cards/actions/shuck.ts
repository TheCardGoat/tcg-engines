import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shuck.generated.ts";

export const shuck = definePitchFamily(fabPitchFamilies["shuck"], {
  abilities: () => ({
    createFlurryToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "flurry",
        controller: "controller",
      },
    },
  }),
});

export const { blue: shuckBlue } = shuck.cards;
