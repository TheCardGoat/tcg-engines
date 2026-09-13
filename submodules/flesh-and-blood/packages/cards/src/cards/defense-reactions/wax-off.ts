import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/wax-off.generated.ts";

export const waxOff = definePitchFamily(fabPitchFamilies["wax-off"], {
  abilities: () => ({
    createZenStateAfterWaxOn: {
      kind: "resolution",
      condition: {
        type: "played-this",
        per: "turn",
        filter: { name: "Wax On" },
        comparison: { op: "gte", value: 1 },
      },
      effect: {
        type: "create-token",
        token: "zen-state",
        controller: "controller",
      },
    },
  }),
});

export const { blue: waxOffBlue } = waxOff.cards;
