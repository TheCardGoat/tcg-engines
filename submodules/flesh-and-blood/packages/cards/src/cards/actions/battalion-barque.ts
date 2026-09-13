import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/battalion-barque.generated.ts";

export const battalionBarque = definePitchFamily(fabPitchFamilies["battalion-barque"], {
  abilities: () => ({
    modifyNumericPower: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "pitch",
        player: "controller",
        filter: {
          color: ["blue"],
        },
        comparison: {
          op: "gte",
          value: 2,
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
      label: {
        name: "high-tide",
      },
    },
  }),
});
export const {
  red: battalionBarqueRed,
  yellow: battalionBarqueYellow,
  blue: battalionBarqueBlue,
} = battalionBarque.cards;
