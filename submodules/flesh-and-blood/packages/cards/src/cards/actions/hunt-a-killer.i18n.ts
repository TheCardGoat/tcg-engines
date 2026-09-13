import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { huntAKiller } from "./hunt-a-killer.ts";

export const huntAKillerI18n = defineFamilyI18n(huntAKiller, {
  en: {
    name: "Hunt a Killer",
    text: (amount) =>
      `Your next dagger attack this turn gets +${amount}{p} and "When this hits a hero, mark them."\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: huntAKillerRedI18n,
  yellow: huntAKillerYellowI18n,
  blue: huntAKillerBlueI18n,
} = huntAKillerI18n.cards;
