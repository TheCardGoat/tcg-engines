import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { diced } from "./diced.ts";

export const dicedI18n = defineFamilyI18n(diced, {
  en: {
    name: "Diced",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Target dagger attack gets +1{p}.\nYour next dagger attack this turn gets +${amount}{p}.`,
  },
});
export const { red: dicedRedI18n, yellow: dicedYellowI18n, blue: dicedBlueI18n } = dicedI18n.cards;
