import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { stokeVengeance } from "./stoke-vengeance.ts";
const textByColor = {
  red: 'Combo - If Edge of Autumn was the last attack this combat chain, this gets go again and "When this hits, your next attack this combat chain gets +2{p}."',
} as const;
export const stokeVengeanceI18n = defineFamilyI18n(stokeVengeance, {
  en: {
    name: "Stoke Vengeance",
    typeText: "Ninja Action - Attack",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { red: stokeVengeanceRedI18n } = stokeVengeanceI18n.cards;
