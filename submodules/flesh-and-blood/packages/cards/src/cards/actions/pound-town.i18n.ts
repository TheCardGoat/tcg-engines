import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { poundTown } from "./pound-town.ts";

export const poundTownI18n = defineFamilyI18n(poundTown, {
  en: {
    name: "Pound Town",
    text: "Beat Chest\nWhen this attacks, if you've beaten chest this turn, create a Might token.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: poundTownRedI18n,
  yellow: poundTownYellowI18n,
  blue: poundTownBlueI18n,
} = poundTownI18n.cards;
