import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { nextAttackPowerWithOnHit } from "../../authoring/attack-patterns.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/below-the-belt.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const belowTheBelt = definePitchFamily(fabPitchFamilies["below-the-belt"], {
  keywords: [goAgain],
  abilities: () => ({
    destroy: nextAttackPowerWithOnHit({
      amount: 4,
      filter: { typeBox: { subtypes: ["Sword"] } },
      hitTargetFilter: { typeBox: { supertypes: ["Warrior"] } },
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "attack-target",
          zones: ["arsenal"],
          count: 1,
        },
      },
    }),
  }),
});

export const { red: belowTheBeltRed } = belowTheBelt.cards;
