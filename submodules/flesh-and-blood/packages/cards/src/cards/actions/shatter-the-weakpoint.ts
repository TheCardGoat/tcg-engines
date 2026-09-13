import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { nextAttackPowerWithOnHit } from "../../authoring/attack-patterns.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shatter-the-weakpoint.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const shatterTheWeakpoint = definePitchFamily(fabPitchFamilies["shatter-the-weakpoint"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackPowerWithOnHit: nextAttackPowerWithOnHit({
      amount: 4,
      filter: { typeBox: { subtypes: ["Sword"] } },
      hitTargetFilter: { typeBox: { supertypes: ["Warrior"] } },
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "attack-target",
          zones: ["permanent"],
          filter: { typeBox: { types: ["Equipment"] }, defense: { op: "eq", value: 0 } },
          count: 1,
        },
      },
    }),
  }),
});
export const { red: shatterTheWeakpointRed } = shatterTheWeakpoint.cards;
