import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/searing-ray.generated.ts";

const abilities = {
  resolutionModifyNumeric: {
    kind: "resolution",
    condition: {
      type: "pitch-zone-has",
      filter: {
        color: ["yellow"],
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
  },
} as const;

export const searingRay = definePitchFamily(fabPitchFamilies["searing-ray"], {
  abilities: () => abilities,
});

export const {
  red: searingRayRed,
  yellow: searingRayYellow,
  blue: searingRayBlue,
} = searingRay.cards;
