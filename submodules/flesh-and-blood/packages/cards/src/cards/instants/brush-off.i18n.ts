import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { brushOff } from "./brush-off.ts";

export const brushOffI18n = defineFamilyI18n(brushOff, {
  en: {
    name: "Brush Off",
    typeText: "Generic Instant",
    text: ({ threshold }) =>
      `The next time you would be dealt ${threshold} or less damage this turn, prevent it.`,
  },
});

export const {
  red: brushOffRedI18n,
  yellow: brushOffYellowI18n,
  blue: brushOffBlueI18n,
} = brushOffI18n.cards;
