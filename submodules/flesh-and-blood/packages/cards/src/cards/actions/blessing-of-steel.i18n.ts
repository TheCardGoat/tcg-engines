import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfSteel } from "./blessing-of-steel.ts";

export const blessingOfSteelI18n = defineFamilyI18n(blessingOfSteel, {
  en: {
    name: "Blessing of Steel",
    text: (_parameter, color) =>
      `At the start of your turn, destroy this then your next weapon attack this turn gets +${
        color === "red" ? 3 : color === "yellow" ? 2 : 1
      }{p}.`,
    typeText: "Warrior Action - Aura",
  },
});

export const {
  red: blessingOfSteelRedI18n,
  yellow: blessingOfSteelYellowI18n,
  blue: blessingOfSteelBlueI18n,
} = blessingOfSteelI18n.cards;
