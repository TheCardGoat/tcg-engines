import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fireTenetStrikeFirst } from "./fire-tenet-strike-first.ts";

export const fireTenetStrikeFirstI18n = defineFamilyI18n(fireTenetStrikeFirst, {
  en: {
    name: "Fire Tenet: Strike First",
    typeText: "Ninja Action - Attack",
    text: "When this attacks, your next Draconic attack this combat chain gets +1{p}.\nGo again",
  },
});

export const {
  red: fireTenetStrikeFirstRedI18n,
  yellow: fireTenetStrikeFirstYellowI18n,
  blue: fireTenetStrikeFirstBlueI18n,
} = fireTenetStrikeFirstI18n.cards;
