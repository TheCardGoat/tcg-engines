import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { warmongerSRecital } from "./warmonger-s-recital.ts";

export const warmongerSRecitalI18n = defineFamilyI18n(warmongerSRecital, {
  en: {
    name: "Warmonger's Recital",
    typeText: "Generic Action",
    text: ({ powerBonus }) =>
      `The next attack action card you play this turn gains +${powerBonus}{p} and "When this hits, put it on the bottom of its owner's deck."\nGo again`,
  },
});

export const {
  red: warmongerSRecitalRedI18n,
  yellow: warmongerSRecitalYellowI18n,
  blue: warmongerSRecitalBlueI18n,
} = warmongerSRecitalI18n.cards;
