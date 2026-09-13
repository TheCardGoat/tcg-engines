import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { battlePrep } from "./battle-prep.ts";

export const battlePrepI18n = defineFamilyI18n(battlePrep, {
  en: {
    name: "Battle Prep",
    typeText: "Generic Action",
    text: (amount) =>
      `Opt 2\nIf this was played from arsenal, your next attack this turn gets +${amount}{p}.\nGo again`,
  },
});

export const {
  red: battlePrepRedI18n,
  yellow: battlePrepYellowI18n,
  blue: battlePrepBlueI18n,
} = battlePrepI18n.cards;
