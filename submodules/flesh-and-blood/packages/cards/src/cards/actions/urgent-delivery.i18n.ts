import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { urgentDelivery } from "./urgent-delivery.ts";

export const urgentDeliveryI18n = defineFamilyI18n(urgentDelivery, {
  en: {
    name: "Urgent Delivery",
    text: "When this hits, you may put a Mechanologist item from your hand into the arena with cost less than or equal to the number of times you've boosted this combat chain.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: urgentDeliveryRedI18n,
  yellow: urgentDeliveryYellowI18n,
  blue: urgentDeliveryBlueI18n,
} = urgentDeliveryI18n.cards;
