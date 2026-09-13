import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { autumnSTouch } from "./autumn-s-touch.ts";

export const autumnSTouchI18n = defineFamilyI18n(autumnSTouch, {
  en: {
    name: "Autumn's Touch",
    typeText: "Earth Action - Attack",
  },
});

export const {
  red: autumnSTouchRedI18n,
  yellow: autumnSTouchYellowI18n,
  blue: autumnSTouchBlueI18n,
} = autumnSTouchI18n.cards;
