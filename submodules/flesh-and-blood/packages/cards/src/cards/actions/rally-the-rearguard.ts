import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rally-the-rearguard.generated.ts";

export const rallyTheRearguard = definePitchFamily(fabPitchFamilies["rally-the-rearguard"], {
  abilities: () => ({
    instantDiscardHasStatusDefendingModifyNumericDefenseThisTurn: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard",
        count: 1,
      },
      condition: {
        type: "has-status",
        status: "defending",
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const {
  red: rallyTheRearguardRed,
  yellow: rallyTheRearguardYellow,
  blue: rallyTheRearguardBlue,
} = rallyTheRearguard.cards;
