import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rocktopBellow } from "./rocktop-bellow.ts";

export const rocktopBellowI18n = defineFamilyI18n(rocktopBellow, {
  en: {
    name: "Rocktop Bellow",
    typeText: "Brute Action",
    text: "Reveal the top card of your deck. If the revealed card has 6 or more base {p}, your next attack this turn gets overpower. Otherwise, put the revealed card on the bottom.\nYour next attack this turn gets +4{p}. Go again",
  },
});

export const {
  red: rocktopBellowRedI18n,
  yellow: rocktopBellowYellowI18n,
  blue: rocktopBellowBlueI18n,
} = rocktopBellowI18n.cards;
