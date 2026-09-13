import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { steelOnSteel } from "./steel-on-steel.ts";

export const steelOnSteelI18n = defineFamilyI18n(steelOnSteel, {
  en: {
    name: "Steel on Steel",
    text: "While this is defending a weapon attack, this gets +1{d}.",
    typeText: "Warrior Defense Reaction",
  },
});

export const {
  red: steelOnSteelRedI18n,
  yellow: steelOnSteelYellowI18n,
  blue: steelOnSteelBlueI18n,
} = steelOnSteelI18n.cards;
