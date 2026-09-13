import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shatteringFlowtide } from "./shattering-flowtide.ts";

export const shatteringFlowtideI18n = defineFamilyI18n(shatteringFlowtide, {
  en: {
    name: "Shattering Flowtide",
    typeText: "Lightning Illusionist Action - Attack",
    text: "Whenever this fragments, create a Lightning Flow token.\nFragment",
  },
});

export const {
  red: shatteringFlowtideRedI18n,
  yellow: shatteringFlowtideYellowI18n,
  blue: shatteringFlowtideBlueI18n,
} = shatteringFlowtideI18n.cards;
