import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/runic-reaving.generated.ts";
import { usurp } from "../shared/keywords.ts";

export const runicReaving = definePitchFamily(fabPitchFamilies["runic-reaving"], {
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
  red: runicReavingRed,
  yellow: runicReavingYellow,
  blue: runicReavingBlue,
} = runicReaving.cards;
