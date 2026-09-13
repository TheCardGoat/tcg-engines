import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { scuttleTheCanal } from "./scuttle-the-canal.ts";

export const scuttleTheCanalI18n = defineFamilyI18n(scuttleTheCanal, {
  en: {
    name: "Scuttle the Canal",
    text: "Stealth\nWhen this attacks a marked hero, this gets go again.",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: scuttleTheCanalRedI18n,
  yellow: scuttleTheCanalYellowI18n,
  blue: scuttleTheCanalBlueI18n,
} = scuttleTheCanalI18n.cards;
