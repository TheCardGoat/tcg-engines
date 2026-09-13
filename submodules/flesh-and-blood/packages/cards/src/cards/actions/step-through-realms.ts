import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { nextAttackPowerWithOnHit } from "../../authoring/attack-patterns.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/step-through-realms.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const stepThroughRealms = definePitchFamily(fabPitchFamilies["step-through-realms"], {
  parameters: {
    red: { powerBonus: 4 },
    yellow: { powerBonus: 3 },
    blue: { powerBonus: 2 },
  },
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    nextAttackPowerWithOnHit: nextAttackPowerWithOnHit({
      amount: powerBonus,
      filter: { typeBox: { supertypes: ["Shadow"], subtypes: ["Attack"] } },
      effect: {
        type: "create-token",
        token: "gate-to-i-arathael",
        controller: "controller",
      },
    }),
  }),
});

export const {
  red: stepThroughRealmsRed,
  yellow: stepThroughRealmsYellow,
  blue: stepThroughRealmsBlue,
} = stepThroughRealms.cards;
