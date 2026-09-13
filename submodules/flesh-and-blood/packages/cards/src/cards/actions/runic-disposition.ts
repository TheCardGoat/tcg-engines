import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/runic-disposition.generated.ts";
import { usurp } from "../shared/keywords.ts";

export const runicDisposition = definePitchFamily(fabPitchFamilies["runic-disposition"], {
  keywords: [usurp],
  abilities: () => ({
    discard: {
      kind: "activated",
      abilityType: "instant",
      functionalZones: ["hand"],
      cost: { class: "effect", type: "discard-self" },
      effect: { type: "create-token", token: "runechant", controller: "controller" },
    },
  }),
});
export const {
  red: runicDispositionRed,
  yellow: runicDispositionYellow,
  blue: runicDispositionBlue,
} = runicDisposition.cards;
