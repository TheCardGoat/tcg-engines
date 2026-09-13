import { nextAttackAction, plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sloggism.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sloggism = definePitchFamily(fabPitchFamilies.sloggism, {
  parameters: pitchMap({
    red: { powerBonus: 6 },
    yellow: { powerBonus: 5 },
    blue: { powerBonus: 4 },
  }),
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    empowerNextHighCostAttack: nextAttackAction({
      filter: {
        numeric: [{ property: "cost", basis: "base", comparison: { op: "gte", value: 2 } }],
      },
      grant: plusPower(powerBonus),
    }),
  }),
});

export const { red: sloggismRed, yellow: sloggismYellow, blue: sloggismBlue } = sloggism.cards;
