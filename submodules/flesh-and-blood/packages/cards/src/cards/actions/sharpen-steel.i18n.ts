import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sharpenSteel } from "./sharpen-steel.ts";

export const sharpenSteelI18n = defineFamilyI18n(sharpenSteel, {
  en: {
    name: "Sharpen Steel",
    typeText: "Warrior Action",
    text: ({ powerBonus }) =>
      `Your next weapon attack this turn gains +${powerBonus}{p}.\nGo again`,
  },
});

export const {
  red: sharpenSteelRedI18n,
  yellow: sharpenSteelYellowI18n,
  blue: sharpenSteelBlueI18n,
} = sharpenSteelI18n.cards;
