import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { recoil } from "./recoil.ts";

export const recoilI18n = defineFamilyI18n(recoil, {
  en: {
    name: "Recoil",
    text: 'Combo - If Head Jab was the last attack this combat chain, this has "When this hits a hero, they put a card from their hand on top of their deck."',
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: recoilRedI18n,
  yellow: recoilYellowI18n,
  blue: recoilBlueI18n,
} = recoilI18n.cards;
