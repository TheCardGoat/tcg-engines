import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { vexingGloomblade } from "./vexing-gloomblade.ts";

export const vexingGloombladeI18n = defineFamilyI18n(vexingGloomblade, {
  en: {
    name: "Vexing Gloomblade",
    typeText: "Shadow Runeblade Action - Attack",
    text: "You may play this from your banished zone.\nUsurp\nWhen this hits a hero, deal 2 arcane damage to any target.\nBlood Debt",
  },
});

export const {
  red: vexingGloombladeRedI18n,
  yellow: vexingGloombladeYellowI18n,
  blue: vexingGloombladeBlueI18n,
} = vexingGloombladeI18n.cards;
