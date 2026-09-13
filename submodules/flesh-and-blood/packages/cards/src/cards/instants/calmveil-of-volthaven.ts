import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/calmveil-of-volthaven.generated.ts";

export const calmveilOfVolthaven = definePitchFamily(fabPitchFamilies["calmveil-of-volthaven"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    preventDamage: {
      type: "prevention",
      preventionKind: "fixed",
      amount,
      shielded: {
        selector: "controller",
      },
      duration: "this-turn",
      additionalModification: {
        type: "create-token",
        token: "lightning-flow",
        controller: "controller",
      },
    },
  }),
});

export const {
  red: calmveilOfVolthavenRed,
  yellow: calmveilOfVolthavenYellow,
  blue: calmveilOfVolthavenBlue,
} = calmveilOfVolthaven.cards;
