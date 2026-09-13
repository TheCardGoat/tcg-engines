import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { takeAStab } from "./take-a-stab.ts";

export const takeAStabI18n = defineFamilyI18n(takeAStab, {
  en: {
    name: "Take a Stab",
    typeText: "Assassin / Warrior Attack Reaction",
    text: (amount) =>
      `Target dagger attack gets +${amount}{p} and "When this hits a marked hero, you may attack with it an additional time this turn."`,
  },
});
export const {
  red: takeAStabRedI18n,
  yellow: takeAStabYellowI18n,
  blue: takeAStabBlueI18n,
} = takeAStabI18n.cards;
