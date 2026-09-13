import { plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sharpen-steel.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sharpenSteel = definePitchFamily(fabPitchFamilies["sharpen-steel"], {
  parameters: pitchMap({
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  }),
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    empowerNextWeaponAttack: plusPower(powerBonus, {
      appliesTo: { next: { typeBox: { types: ["Weapon"] } } },
    }),
  }),
});

export const {
  red: sharpenSteelRed,
  yellow: sharpenSteelYellow,
  blue: sharpenSteelBlue,
} = sharpenSteel.cards;
