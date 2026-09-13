import { nextAttackAction, plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/come-to-fight.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const comeToFight = definePitchFamily(fabPitchFamilies["come-to-fight"], {
  parameters: pitchMap({
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  }),
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    empowerNextAttack: nextAttackAction({ grant: plusPower(powerBonus) }),
  }),
});

export const {
  red: comeToFightRed,
  yellow: comeToFightYellow,
  blue: comeToFightBlue,
} = comeToFight.cards;
