import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tremor-of-i-arathael.generated.ts";

export const tremorOfIArathael = definePitchFamily(fabPitchFamilies["tremor-of-i-arathael"], {
  abilities: () => ({
    resolutionModifyNumeric: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "banished",
        player: "controller",
        comparison: { op: "gte", value: 1 },
        per: "turn",
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
    },
  }),
});

export const {
  red: tremorOfIArathaelRed,
  yellow: tremorOfIArathaelYellow,
  blue: tremorOfIArathaelBlue,
} = tremorOfIArathael.cards;
