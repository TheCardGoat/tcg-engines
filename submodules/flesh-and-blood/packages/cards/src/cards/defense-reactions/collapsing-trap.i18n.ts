import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { collapsingTrap } from "./collapsing-trap.ts";

export const collapsingTrapI18n = defineFamilyI18n(collapsingTrap, {
  en: {
    name: "Collapsing Trap",
    text: "Legendary Riptide Specialization\nWhen this defends an attack with go again, the attacking hero discards their hand then draws that many cards minus 1.",
    typeText: "Ranger Defense Reaction - Trap",
  },
});

export const { blue: collapsingTrapBlueI18n } = collapsingTrapI18n.cards;
