import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { phantasmify } from "./phantasmify.ts";

export const phantasmifyI18n = defineFamilyI18n(phantasmify, {
  en: {
    name: "Phantasmify",
    typeText: "Illusionist Action",
    text: (powerBonus) =>
      `The next attack action card you play this turn is Illusionist in addition to its other class types, and gains +${powerBonus}{p} and phantasm.\nGo again`,
  },
});

export const {
  red: phantasmifyRedI18n,
  yellow: phantasmifyYellowI18n,
  blue: phantasmifyBlueI18n,
} = phantasmifyI18n.cards;
