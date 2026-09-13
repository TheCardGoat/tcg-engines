import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { runeFlash } from "./rune-flash.ts";

export const runeFlashI18n = defineFamilyI18n(runeFlash, {
  en: {
    name: "Rune Flash",
    text: ({ self }) =>
      self
        ? "This costs {r} less to play for each Runechant token you control.\nGo again"
        : "Rune Flash costs {r} less to play for each Runechant you control.\nGo again",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: runeFlashRedI18n,
  yellow: runeFlashYellowI18n,
  blue: runeFlashBlueI18n,
} = runeFlashI18n.cards;
