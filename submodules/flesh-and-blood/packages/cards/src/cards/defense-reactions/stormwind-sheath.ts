import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/stormwind-sheath.generated.ts";

export const stormwindSheath = definePitchFamily(fabPitchFamilies["stormwind-sheath"], {
  abilities: () => ({
    lightningBond: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-lightning-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "create-token",
        token: "embodiment-of-lightning",
        controller: "controller",
      },
      label: {
        name: "lightning-bond",
      },
    },
  }),
});

export const { red: stormwindSheathRed } = stormwindSheath.cards;
