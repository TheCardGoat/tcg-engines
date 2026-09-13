import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { qiUnleashed } from "./qi-unleashed.ts";

export const qiUnleashedI18n = defineFamilyI18n(qiUnleashed, {
  en: {
    name: "Qi Unleashed",
    text: "Combo - If Crouching Tiger was the last attack this combat chain, this gets +4{p}.",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: qiUnleashedRedI18n,
  yellow: qiUnleashedYellowI18n,
  blue: qiUnleashedBlueI18n,
} = qiUnleashedI18n.cards;
