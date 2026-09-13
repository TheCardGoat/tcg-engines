import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rally-the-coast-guard.generated.ts";

export const rallyTheCoastGuard = definePitchFamily(fabPitchFamilies["rally-the-coast-guard"], {
  abilities: () => ({
    rally: {
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
        status: "this-is-defending",
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
  red: rallyTheCoastGuardRed,
  yellow: rallyTheCoastGuardYellow,
  blue: rallyTheCoastGuardBlue,
} = rallyTheCoastGuard.cards;
