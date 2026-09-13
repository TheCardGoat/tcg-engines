import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { inTheSwing } from "./in-the-swing.ts";

export const inTheSwingI18n = defineFamilyI18n(inTheSwing, {
  en: {
    name: "In the Swing",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Play this only if you've attacked 2 or more times with weapons this turn.\nTarget weapon attack gains +${amount}{p}.`,
  },
});
export const {
  red: inTheSwingRedI18n,
  yellow: inTheSwingYellowI18n,
  blue: inTheSwingBlueI18n,
} = inTheSwingI18n.cards;
