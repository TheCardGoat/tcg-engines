import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flitteringCharge } from "./flittering-charge.ts";

export const flitteringChargeI18n = defineFamilyI18n(flitteringCharge, {
  en: {
    name: "Flittering Charge",
    typeText: "Lightning Action - Attack",
    text: "If you've played an instant card this chain link, this gets go again.",
  },
});

export const {
  red: flitteringChargeRedI18n,
  yellow: flitteringChargeYellowI18n,
  blue: flitteringChargeBlueI18n,
} = flitteringChargeI18n.cards;
