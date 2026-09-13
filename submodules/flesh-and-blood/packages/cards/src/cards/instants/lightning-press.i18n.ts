import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lightningPress } from "./lightning-press.ts";

export const lightningPressI18n = defineFamilyI18n(lightningPress, {
  en: {
    name: "Lightning Press",
    typeText: "Lightning Instant",
    text: ({ amount }) => `Target attack action card with cost 1 or less gains +${amount}{p}.`,
  },
});

export const {
  red: lightningPressRedI18n,
  yellow: lightningPressYellowI18n,
  blue: lightningPressBlueI18n,
} = lightningPressI18n.cards;
