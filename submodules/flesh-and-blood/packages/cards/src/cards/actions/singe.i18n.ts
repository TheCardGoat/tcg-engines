import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { singe } from "./singe.ts";

export const singeI18n = defineFamilyI18n(singe, {
  en: {
    name: "Singe",
    text: ({ allyCount }) =>
      `Deal 1 arcane damage to target hero and up to ${allyCount} target ${allyCount === 1 ? "ally" : "allies"} they control.`,
    typeText: "Wizard Action",
  },
});

export const { red: singeRedI18n, yellow: singeYellowI18n, blue: singeBlueI18n } = singeI18n.cards;
