import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { clamberingCorpses } from "./clambering-corpses.ts";

export const clamberingCorpsesI18n = defineFamilyI18n(clamberingCorpses, {
  en: {
    name: "Clambering Corpses",
    typeText: "Shadow Necromancer Action - Attack",
    text: "When this attacks, you may discard a zombie. If you do, this gets +3{p} and go again.\nWhen this hits a hero, your zombie attacks this turn get go again.",
  },
});

export const { blue: clamberingCorpsesBlueI18n } = clamberingCorpsesI18n.cards;
