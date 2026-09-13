import { plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/battle-clearing-bellow.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const battleClearingBellow = definePitchFamily(fabPitchFamilies["battle-clearing-bellow"], {
  keywords: [goAgain],
  abilities: () => ({
    power: plusPower(6, {
      appliesTo: {
        next: {
          numeric: [{ property: "power", basis: "base", comparison: { op: "gte", value: 6 } }],
          typeBox: { subtypes: ["Attack"] },
        },
      },
    }),
  }),
});
export const { blue: battleClearingBellowBlue } = battleClearingBellow.cards;
