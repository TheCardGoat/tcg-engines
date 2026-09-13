import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/fertile-ground.generated.ts";

export const fertileGround = definePitchFamily(fabPitchFamilies["fertile-ground"], {
  parameters: pitchMap({
    red: { thresholdGain: 5 },
    yellow: { thresholdGain: 4 },
    blue: { thresholdGain: 3 },
  }),
  abilities: ({ thresholdGain }) => ({
    gainLife: {
      type: "conditional",
      condition: {
        type: "zone-count",
        zone: "banished",
        player: "controller",
        filter: { typeBox: { supertypes: ["Earth"] } },
        comparison: { op: "gte", value: 4 },
      },
      then: { type: "gain-life", amount: thresholdGain, target: { selector: "controller" } },
      else: { type: "gain-life", amount: 2, target: { selector: "controller" } },
    },
  }),
});

export const {
  red: fertileGroundRed,
  yellow: fertileGroundYellow,
  blue: fertileGroundBlue,
} = fertileGround.cards;
