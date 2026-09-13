import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { jackOLantern } from "./jack-o-lantern.ts";

export const jackOLanternI18n = defineFamilyI18n(jackOLantern, {
  en: {
    name: "Jack-o'-lantern",
    text: (color) =>
      `Banish the top card of your deck. If it's ${color}, create a Runechant token.`,
    typeText: "Shadow Runeblade Action",
  },
});

export const {
  red: jackOLanternRedI18n,
  yellow: jackOLanternYellowI18n,
  blue: jackOLanternBlueI18n,
} = jackOLanternI18n.cards;
