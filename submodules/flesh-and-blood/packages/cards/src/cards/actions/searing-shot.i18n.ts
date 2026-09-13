import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { searingShot } from "./searing-shot.ts";

export const searingShotI18n = defineFamilyI18n(searingShot, {
  en: {
    name: "Searing Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Searing Shot hits a hero, they lose 1{h}.",
  },
});

export const {
  red: searingShotRedI18n,
  yellow: searingShotYellowI18n,
  blue: searingShotBlueI18n,
} = searingShotI18n.cards;
