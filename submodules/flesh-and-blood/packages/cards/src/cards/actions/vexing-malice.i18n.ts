import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { vexingMalice } from "./vexing-malice.ts";

export const vexingMaliceI18n = defineFamilyI18n(vexingMalice, {
  en: {
    name: "Vexing Malice",
    text: "Deal 2 arcane damage to target hero.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: vexingMaliceRedI18n,
  yellow: vexingMaliceYellowI18n,
  blue: vexingMaliceBlueI18n,
} = vexingMaliceI18n.cards;
