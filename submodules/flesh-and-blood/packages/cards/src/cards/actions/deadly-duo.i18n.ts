import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { deadlyDuo } from "./deadly-duo.ts";

export const deadlyDuoI18n = defineFamilyI18n(deadlyDuo, {
  en: {
    name: "Deadly Duo",
    typeText: "Ninja Action - Attack",
    text: "When this hits, the next attack action card with 2 or less base {p} you play this combat chain gains +2 {p}.\nGo again",
  },
});

export const {
  red: deadlyDuoRedI18n,
  yellow: deadlyDuoYellowI18n,
  blue: deadlyDuoBlueI18n,
} = deadlyDuoI18n.cards;
