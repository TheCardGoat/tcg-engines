import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { swindlerSGrift } from "./swindler-s-grift.ts";

export const swindlerSGriftI18n = defineFamilyI18n(swindlerSGrift, {
  en: {
    name: "Swindler's Grift",
    text: "When this attacks, you may discard a yellow card. If you do, draw a card and create a Gold token.",
    typeText: "Pirate Action - Attack",
  },
});
export const {
  red: swindlerSGriftRedI18n,
  yellow: swindlerSGriftYellowI18n,
  blue: swindlerSGriftBlueI18n,
} = swindlerSGriftI18n.cards;
