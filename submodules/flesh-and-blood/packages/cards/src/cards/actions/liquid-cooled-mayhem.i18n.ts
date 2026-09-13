import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { liquidCooledMayhem } from "./liquid-cooled-mayhem.ts";

export const liquidCooledMayhemI18n = defineFamilyI18n(liquidCooledMayhem, {
  en: {
    name: "Liquid-Cooled Mayhem",
    text: "Evo Upgrade - This costs {r} less to play for each Evo you have equipped.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: liquidCooledMayhemRedI18n,
  yellow: liquidCooledMayhemYellowI18n,
  blue: liquidCooledMayhemBlueI18n,
} = liquidCooledMayhemI18n.cards;
