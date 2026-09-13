import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { combustibleCourier } from "./combustible-courier.ts";

export const combustibleCourierI18n = defineFamilyI18n(combustibleCourier, {
  en: {
    name: "Combustible Courier",
    text: "If Combustible Courier hits, the next attack you boost this combat chain gains +3{p}.\nBoost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: combustibleCourierRedI18n,
  yellow: combustibleCourierYellowI18n,
  blue: combustibleCourierBlueI18n,
} = combustibleCourierI18n.cards;
