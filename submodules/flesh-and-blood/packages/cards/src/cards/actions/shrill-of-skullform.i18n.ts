import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shrillOfSkullform } from "./shrill-of-skullform.ts";

export const shrillOfSkullformI18n = defineFamilyI18n(shrillOfSkullform, {
  en: {
    name: "Shrill of Skullform",
    text: "If you have played or created an aura this turn, Shrill of Skullform gains +3{p}.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: shrillOfSkullformRedI18n,
  yellow: shrillOfSkullformYellowI18n,
  blue: shrillOfSkullformBlueI18n,
} = shrillOfSkullformI18n.cards;
