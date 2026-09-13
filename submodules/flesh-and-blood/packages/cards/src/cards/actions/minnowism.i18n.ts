import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { minnowism } from "./minnowism.ts";

export const minnowismI18n = defineFamilyI18n(minnowism, {
  en: {
    name: "Minnowism",
    typeText: "Generic Action",
    text: ({ powerBonus }) =>
      `The next attack action card with 3 or less base {p} you play this turn gains +${powerBonus}{p}.\nGo again`,
  },
});

export const {
  red: minnowismRedI18n,
  yellow: minnowismYellowI18n,
  blue: minnowismBlueI18n,
} = minnowismI18n.cards;
