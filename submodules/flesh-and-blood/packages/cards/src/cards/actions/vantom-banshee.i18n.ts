import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { vantomBanshee } from "./vantom-banshee.ts";

export const vantomBansheeI18n = defineFamilyI18n(vantomBanshee, {
  en: {
    name: "Vantom Banshee",
    text: "Rune Gate\nBlood Debt",
    typeText: "Shadow Runeblade Action - Attack",
  },
});

export const {
  red: vantomBansheeRedI18n,
  yellow: vantomBansheeYellowI18n,
  blue: vantomBansheeBlueI18n,
} = vantomBansheeI18n.cards;
