import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { reCharge } from "./re-charge.ts";

export const reChargeI18n = defineFamilyI18n(reCharge, {
  en: {
    name: "Re-Charge!",
    text: ({ value3 }) =>
      `Put a steam counter on a Hyper Driver you control.\nThe next attack you boost this turn gets +${value3}{p}.\nGo again`,
    typeText: "Mechanologist Action",
  },
});

export const {
  red: reChargeRedI18n,
  yellow: reChargeYellowI18n,
  blue: reChargeBlueI18n,
} = reChargeI18n.cards;
