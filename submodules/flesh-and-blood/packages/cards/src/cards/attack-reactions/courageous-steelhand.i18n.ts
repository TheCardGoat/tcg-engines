import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { courageousSteelhand } from "./courageous-steelhand.ts";

export const courageousSteelhandI18n = defineFamilyI18n(courageousSteelhand, {
  en: {
    name: "Courageous Steelhand",
    typeText: "Light Warrior Attack Reaction",
    text: (amount) => `If you've charged this turn, target attack gains +${amount}{p}.`,
  },
});
export const {
  red: courageousSteelhandRedI18n,
  yellow: courageousSteelhandYellowI18n,
  blue: courageousSteelhandBlueI18n,
} = courageousSteelhandI18n.cards;
