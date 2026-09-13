import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { holdEm } from "./hold-em.ts";

export const holdEmI18n = defineFamilyI18n(holdEm, {
  en: {
    name: "Hold 'em",
    text: (amount) =>
      `Your next Warrior attack this turn gets +${amount}{p} and "When this attacks a hero, you may wager a Vigor token with them."\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: holdEmRedI18n,
  yellow: holdEmYellowI18n,
  blue: holdEmBlueI18n,
} = holdEmI18n.cards;
