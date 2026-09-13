import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/leaven-sheath.generated.ts";

export const leavenSheath = definePitchFamily(fabPitchFamilies["leaven-sheath"], {
  abilities: () => ({
    earthBond: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-earth-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "create-token",
        token: "embodiment-of-earth",
        controller: "controller",
      },
      label: {
        name: "earth-bond",
      },
    },
  }),
});

export const { red: leavenSheathRed } = leavenSheath.cards;
