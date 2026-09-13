import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { nextAttackPowerWithOnHit } from "../../authoring/attack-patterns.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/steel-to-the-dome.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const steelToTheDome = definePitchFamily(fabPitchFamilies["steel-to-the-dome"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackPowerWithOnHit: nextAttackPowerWithOnHit({
      amount: 4,
      filter: { typeBox: { subtypes: ["Sword"] } },
      hitTargetFilter: { typeBox: { supertypes: ["Warrior"] } },
      effect: {
        type: "discard",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "attack-target",
          zones: ["hand"],
          count: 1,
        },
      },
    }),
  }),
});
export const { red: steelToTheDomeRed } = steelToTheDome.cards;
