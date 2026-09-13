import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { savageSwing } from "./savage-swing.ts";

export const savageSwingI18n = defineFamilyI18n(savageSwing, {
  en: {
    name: "Savage Swing",
    text: "As an additional cost to play Savage Swing, discard a random card.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: savageSwingRedI18n,
  yellow: savageSwingYellowI18n,
  blue: savageSwingBlueI18n,
} = savageSwingI18n.cards;
