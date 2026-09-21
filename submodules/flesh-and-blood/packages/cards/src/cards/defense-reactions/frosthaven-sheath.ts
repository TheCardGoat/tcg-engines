import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/frosthaven-sheath.generated.ts";

export const frosthavenSheath = definePitchFamily(fabPitchFamilies["frosthaven-sheath"], {
  abilities: () => ({
    iceBond: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-ice-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "create-token",
        token: "frostbite",
        creator: "effect-controller",
        controller: "opponent",
      },
      label: {
        name: "ice-bond",
      },
    },
  }),
});

export const { red: frosthavenSheathRed } = frosthavenSheath.cards;
