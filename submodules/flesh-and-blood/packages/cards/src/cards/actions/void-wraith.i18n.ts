import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { voidWraith } from "./void-wraith.ts";

export const voidWraithI18n = defineFamilyI18n(voidWraith, {
  en: {
    name: "Void Wraith",
    text: "You may play Void Wraith from your banished zone.\nBlood Debt",
    typeText: "Shadow Action - Attack",
  },
});

export const {
  red: voidWraithRedI18n,
  yellow: voidWraithYellowI18n,
  blue: voidWraithBlueI18n,
} = voidWraithI18n.cards;
