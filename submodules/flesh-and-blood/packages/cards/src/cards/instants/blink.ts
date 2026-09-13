import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/blink.generated.ts";

export const blink = definePitchFamily(fabPitchFamilies["blink"], {
  abilities: () => ({
    gain1ActionPoint: {
      kind: "resolution",
      effect: {
        type: "gain-action-points",
        amount: 1,
      },
    },
  }),
});

export const { blue: blinkBlue } = blink.cards;
