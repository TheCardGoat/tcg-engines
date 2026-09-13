import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { wallop } from "./wallop.ts";

export const wallopI18n = defineFamilyI18n(wallop, {
  en: {
    name: "Wallop",
    text: "When you win a clash revealing this, create a Vigor token.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: wallopRedI18n,
  yellow: wallopYellowI18n,
  blue: wallopBlueI18n,
} = wallopI18n.cards;
