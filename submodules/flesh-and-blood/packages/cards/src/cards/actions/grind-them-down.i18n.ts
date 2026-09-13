import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { grindThemDown } from "./grind-them-down.ts";

export const grindThemDownI18n = defineFamilyI18n(grindThemDown, {
  en: {
    name: "Grind Them Down",
    text: "Crush - When this deals 4 or more damage to a hero, destroy the top card of their deck.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: grindThemDownRedI18n,
  yellow: grindThemDownYellowI18n,
  blue: grindThemDownBlueI18n,
} = grindThemDownI18n.cards;
