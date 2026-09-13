import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/high-voltage.generated.ts";

export const highVoltage = definePitchFamily(fabPitchFamilies["high-voltage"], {
  keywords: [
    {
      name: "amp",
      value: 1,
    },
  ],
  abilities: () => ({
    amp1: {
      kind: "resolution",
      effect: {
        type: "amp",
        amount: 1,
      },
    },
  }),
});

export const { blue: highVoltageBlue } = highVoltage.cards;
