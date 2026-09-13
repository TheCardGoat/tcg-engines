import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { moneyOrYourLife } from "./money-or-your-life.ts";

export const moneyOrYourLifeI18n = defineFamilyI18n(moneyOrYourLife, {
  en: {
    name: "Money or Your Life?",
    text: "When this hits a hero, deal 2 damage to them unless they give you a Gold token they control. If you are a Thief, repeat this process once.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: moneyOrYourLifeRedI18n,
  yellow: moneyOrYourLifeYellowI18n,
  blue: moneyOrYourLifeBlueI18n,
} = moneyOrYourLifeI18n.cards;
