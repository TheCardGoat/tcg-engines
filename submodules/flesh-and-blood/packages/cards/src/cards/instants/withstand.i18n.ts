import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { withstand } from "./withstand.ts";

export const withstandI18n = defineFamilyI18n(withstand, {
  en: {
    name: "Withstand",
    typeText: "Guardian Instant",
    text: (amount) =>
      `The next time target Guardian off-hand defends this turn, it gains +${amount}{d} until the combat chain closes.`,
  },
});

export const {
  red: withstandRedI18n,
  yellow: withstandYellowI18n,
  blue: withstandBlueI18n,
} = withstandI18n.cards;
