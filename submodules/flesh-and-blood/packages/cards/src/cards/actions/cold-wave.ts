import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cold-wave.generated.ts";

export const coldWave = definePitchFamily(fabPitchFamilies["cold-wave"], {
  parameters: pitchMap({ red: { value1: 1 }, yellow: { value1: 1 }, blue: { value1: 1 } }),
  keywords: [fusion("Ice")],
  abilities: ({ value1 }) => ({
    resolutionHasStatusFusedModifyNumericCost: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "add",
        amount: value1,
        target: {
          selector: "opponent",
        },
        duration: "this-turn",
        appliesTo: {
          next: {},
          count: { type: "all" },
          events: ["play", "activate"],
        },
      },
    },
  }),
});

export const { red: coldWaveRed, yellow: coldWaveYellow, blue: coldWaveBlue } = coldWave.cards;
