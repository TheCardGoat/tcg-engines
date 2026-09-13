import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { moneyWhereYaMouthIs } from "./money-where-ya-mouth-is.ts";

export const moneyWhereYaMouthIsI18n = defineFamilyI18n(moneyWhereYaMouthIs, {
  en: {
    name: "Money Where Ya Mouth Is",
    typeText: "Generic Action",
    text: ({ powerBonus }) =>
      `Your next attack this turn gets +${powerBonus}{p} and "When this attacks a hero, you may wager a Gold token with them."\nGo again`,
  },
});

export const {
  red: moneyWhereYaMouthIsRedI18n,
  yellow: moneyWhereYaMouthIsYellowI18n,
  blue: moneyWhereYaMouthIsBlueI18n,
} = moneyWhereYaMouthIsI18n.cards;
