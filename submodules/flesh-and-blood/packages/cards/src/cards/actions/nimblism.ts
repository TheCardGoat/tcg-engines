import { nextAttackAction, plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/nimblism.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const nimblism = definePitchFamily(fabPitchFamilies.nimblism, {
  parameters: {
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  },
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    buffNextLowCostAttack: nextAttackAction({
      filter: { cost: { op: "lte", value: 1 } },
      grant: plusPower(powerBonus),
    }),
  }),
});

export const { red: nimblismRed, yellow: nimblismYellow, blue: nimblismBlue } = nimblism.cards;
