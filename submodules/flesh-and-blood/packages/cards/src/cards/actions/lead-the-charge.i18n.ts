import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { leadTheCharge } from "./lead-the-charge.ts";

export const leadTheChargeI18n = defineFamilyI18n(leadTheCharge, {
  en: {
    name: "Lead the Charge",
    typeText: "Generic Action",
    text: ({ threshold }) =>
      `The next time you play an action card with cost ${threshold} or greater this turn, gain 1 action point.\nGo again`,
  },
});

export const {
  red: leadTheChargeRedI18n,
  yellow: leadTheChargeYellowI18n,
  blue: leadTheChargeBlueI18n,
} = leadTheChargeI18n.cards;
