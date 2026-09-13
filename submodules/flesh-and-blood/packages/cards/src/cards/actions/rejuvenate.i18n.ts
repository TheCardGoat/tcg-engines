import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rejuvenate } from "./rejuvenate.ts";

export const rejuvenateI18n = defineFamilyI18n(rejuvenate, {
  en: {
    name: "Rejuvenate",
    text: "Gain 3{h}\nIf you've fused this turn, you may play Rejuvenate as though it were an instant.",
    typeText: "Elemental Action",
  },
});
export const {
  red: rejuvenateRedI18n,
  yellow: rejuvenateYellowI18n,
  blue: rejuvenateBlueI18n,
} = rejuvenateI18n.cards;
