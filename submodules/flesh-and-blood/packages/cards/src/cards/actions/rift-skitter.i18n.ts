import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { riftSkitter } from "./rift-skitter.ts";

export const riftSkitterI18n = defineFamilyI18n(riftSkitter, {
  en: {
    name: "Rift Skitter",
    text: "Rune Gate\nGo again\nBlood Debt",
    typeText: "Shadow Runeblade Action - Attack",
  },
});

export const {
  red: riftSkitterRedI18n,
  yellow: riftSkitterYellowI18n,
  blue: riftSkitterBlueI18n,
} = riftSkitterI18n.cards;
