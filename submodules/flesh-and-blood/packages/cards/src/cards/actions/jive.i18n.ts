import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { jive } from "./jive.ts";

export const jiveI18n = defineFamilyI18n(jive, {
  en: { name: "Jive", typeText: "Warrior Action", text: "Create a Blade Dance token." },
});

export const { blue: jiveBlueI18n } = jiveI18n.cards;
