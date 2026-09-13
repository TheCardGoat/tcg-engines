import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { runIntoTrouble } from "./run-into-trouble.ts";

export const runIntoTroubleI18n = defineFamilyI18n(runIntoTrouble, {
  en: {
    name: "Run into Trouble",
    text: "When this defends, if you control an Agility token, deal 1 damage to the attacking hero.",
    typeText: "Brute / Warrior Block",
  },
});

export const { red: runIntoTroubleRedI18n } = runIntoTroubleI18n.cards;
