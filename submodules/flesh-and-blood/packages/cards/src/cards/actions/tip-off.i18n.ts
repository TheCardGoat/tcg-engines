import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tipOff } from "./tip-off.ts";

export const tipOffI18n = defineFamilyI18n(tipOff, {
  en: {
    name: "Tip-Off",
    text: "Instant - Discard this: Mark target opposing hero.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: tipOffRedI18n,
  yellow: tipOffYellowI18n,
  blue: tipOffBlueI18n,
} = tipOffI18n.cards;
