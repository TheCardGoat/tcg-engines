import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/strong-wood.generated.ts";

export const strongWood = definePitchFamily(fabPitchFamilies["strong-wood"], {
  abilities: () => ({
    gainPowerAfterPitchingEarth: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-earth-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
      label: {
        name: "earth-bond",
      },
    },
  }),
});

export const { red: strongWoodRed, yellow: strongWoodYellow } = strongWood.cards;
