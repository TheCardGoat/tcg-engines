import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/cosmic-flare.generated.ts";

export const cosmicFlare = definePitchFamily(fabPitchFamilies["cosmic-flare"], {
  abilities: () => ({
    gain: {
      kind: "resolution",
      effect: {
        type: "gain-resources",
        amount: 3,
      },
    },
  }),
});

export const { red: cosmicFlareRed } = cosmicFlare.cards;
