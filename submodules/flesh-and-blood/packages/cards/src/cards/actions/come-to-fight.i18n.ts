import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { comeToFight } from "./come-to-fight.ts";

export const comeToFightI18n = defineFamilyI18n(comeToFight, {
  en: {
    name: "Come to Fight",
    typeText: "Generic Action",
    text: ({ powerBonus }) =>
      `The next attack action card you play this turn gains +${powerBonus}{p}.\nGo again`,
  },
});

export const {
  red: comeToFightRedI18n,
  yellow: comeToFightYellowI18n,
  blue: comeToFightBlueI18n,
} = comeToFightI18n.cards;
