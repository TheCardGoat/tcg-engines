import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { vantomWraith } from "./vantom-wraith.ts";

export const vantomWraithI18n = defineFamilyI18n(vantomWraith, {
  en: {
    name: "Vantom Wraith",
    text: "Rune Gate\nBlood Debt",
    typeText: "Shadow Runeblade Action - Attack",
  },
});

export const {
  red: vantomWraithRedI18n,
  yellow: vantomWraithYellowI18n,
  blue: vantomWraithBlueI18n,
} = vantomWraithI18n.cards;
