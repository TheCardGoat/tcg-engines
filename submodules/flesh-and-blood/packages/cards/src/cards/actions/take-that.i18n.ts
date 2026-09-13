import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { takeThat } from "./take-that.ts";

export const takeThatI18n = defineFamilyI18n(takeThat, {
  en: {
    name: "Take That!",
    text: "When the combat chain closes, if this didn't hit, the defending hero creates a Might token.",
    typeText: "Reviled Action - Attack",
  },
});
export const {
  red: takeThatRedI18n,
  yellow: takeThatYellowI18n,
  blue: takeThatBlueI18n,
} = takeThatI18n.cards;
