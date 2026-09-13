import { nextAttackAction, plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/minnowism.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const minnowism = definePitchFamily(fabPitchFamilies.minnowism, {
  parameters: {
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  },
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    empowerNextLowPowerAttack: nextAttackAction({
      filter: {
        numeric: [{ property: "power", basis: "base", comparison: { op: "lte", value: 3 } }],
      },
      grant: plusPower(powerBonus),
    }),
  }),
});

export const { red: minnowismRed, yellow: minnowismYellow, blue: minnowismBlue } = minnowism.cards;
